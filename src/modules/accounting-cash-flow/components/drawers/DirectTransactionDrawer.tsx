"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Input,
  ComboBox,
  ListBox,
  Label,
  TextField,
  DatePicker,
  DateField,
  Calendar,
} from "@heroui/react";
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Cancel01Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { createAccountCharge } from "@/modules/account-charges/actions/create";
import { useRouter } from "next/navigation";
import { FileUploader } from "@/ui/components/file-uploader/FileUploader";
import { useStorage } from "@/hooks/useStorage";
import { SelectOrCreatePerson } from "./SelectOrCreatePerson";
import { IPersonOption } from "@/modules/charge-transactions";
import { PrintReportDialog } from "@/modules/charge-transactions/components/dialog/PrintReportDialog";

import { FinancialAccount } from "@/modules/financial-accounts/interfaces/financial-account.interface";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  QR: "Código QR",
};

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  type: "INCOME" | "EXPENSE";
  categories: Array<{ id: string; name: string }>;
  financialAccounts: FinancialAccount[];
  onSuccess?: () => void;
}

export const DirectTransactionDrawer = ({
  isOpen,
  onOpenChange,
  type,
  categories,
  financialAccounts,
  onSuccess,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [financialAccountId, setFinancialAccountId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const { uploadFiles, isUploading } = useStorage();

  const [printTransactionId, setPrintTransactionId] = useState<string | null>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const [personId, setPersonId] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<IPersonOption | null>(null);

  const [payerPersonId, setPayerPersonId] = useState<string | null>(null);
  const [selectedPayerPerson, setSelectedPayerPerson] = useState<IPersonOption | null>(null);

  const [transactionDate, setTransactionDate] = useState<DateValue | null>(
    today(getLocalTimeZone()),
  );

  useEffect(() => {
    if (isOpen) {
      setConcept("");
      setAmount("");
      setCategoryId("");
      
      const defaultAcc = financialAccounts.find((a) => a.isDefault);
      setFinancialAccountId(defaultAcc ? defaultAcc.id : "");
      setPaymentMethod(defaultAcc?.allowedPaymentMethods?.[0] || "CASH");
      
      setFiles([]);
      setPersonId(null);
      setSelectedPerson(null);
      setPayerPersonId(null);
      setSelectedPayerPerson(null);
      setTransactionDate(today(getLocalTimeZone()));
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (
      !concept ||
      !amount ||
      !categoryId ||
      !paymentMethod ||
      !financialAccountId
    ) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    setIsLoading(true);
    try {
      let attachmentIds: string[] = [];
      if (files.length > 0) {
        const uploadResult = await uploadFiles(files);
        attachmentIds = uploadResult.map((att: any) => att.id);
      }

      // Creamos un AccountCharge pero forzando el pago inmediato
      const res = await createAccountCharge({
        title: concept,
        amount: Number(amount),
        direction: type === "INCOME" ? "RECEIVABLE" : "PAYABLE",
        categoryId,
        dueDate: new Date().toISOString(),
        immediatePayment: {
          paymentMethod,
          financialAccountId,
          transactionDate: transactionDate
            ? transactionDate.toDate(getLocalTimeZone()).toISOString()
            : new Date().toISOString(),
          ...(attachmentIds.length > 0 && { attachmentIds }),
          ...(payerPersonId && { payerPersonId }),
        },
        ...(personId && { personId }),
      });

      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success("Movimiento registrado exitosamente");
        // Refrescar lista de transacciones
        router.refresh();
        
        if (res.data?.immediateTransaction?.data?.transaction?.id) {
          setPrintTransactionId(res.data.immediateTransaction.data.transaction.id);
          setShowPrintDialog(true);
          return;
        }

        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-md" aria-label={type === "INCOME" ? "Registrar Ingreso Directo" : "Registrar Gasto Directo"}>
          <Drawer.CloseTrigger />
          <Drawer.Header className="border-b border-border">
            <Drawer.Heading className="text-lg font-bold">
              {type === "INCOME"
                ? "Registrar Ingreso Directo"
                : "Registrar Gasto Directo"}
            </Drawer.Heading>
          </Drawer.Header>
          <Drawer.Body className="gap-6 pt-6">
            <TextField className="w-full" isRequired>
              <Label className="text-sm font-semibold">Concepto</Label>
              <Input
                placeholder={
                  type === "INCOME"
                    ? "Ej. Venta de material"
                    : "Ej. Compra de limpieza"
                }
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                variant="secondary"
              />
            </TextField>

            <TextField className="w-full" isRequired>
              <Label className="text-sm font-semibold">Monto (Bs)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="secondary"
              />
            </TextField>

            <div className="w-full">
              <DatePicker
                className="w-full"
                name="date"
                value={transactionDate}
                onChange={setTransactionDate}
              >
                <Label className="text-sm font-semibold">Fecha de Comprobante</Label>
                <DateField.Group fullWidth>
                  <DateField.Input>
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                  <DateField.Suffix>
                    <DatePicker.Trigger>
                      <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                  </DateField.Suffix>
                </DateField.Group>
                <DatePicker.Popover>
                  <Calendar aria-label="Event date">
                    <Calendar.Header>
                      <Calendar.YearPickerTrigger>
                        <Calendar.YearPickerTriggerHeading />
                      </Calendar.YearPickerTrigger>
                      <Calendar.YearPickerTriggerIndicator />
                    </Calendar.Header>
                    <Calendar.Grid>
                      <Calendar.GridHeader>
                        {(day) => (
                          <Calendar.HeaderCell>
                            {day}
                          </Calendar.HeaderCell>
                        )}
                      </Calendar.GridHeader>
                      <Calendar.GridBody>
                        {(date) => <Calendar.Cell date={date} />}
                      </Calendar.GridBody>
                    </Calendar.Grid>
                    <Calendar.YearPickerGrid>
                      <Calendar.YearPickerGridBody>
                        {({ year }) => (
                          <Calendar.YearPickerCell year={year} />
                        )}
                      </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                  </Calendar>
                </DatePicker.Popover>
              </DatePicker>
            </div>

            <SelectOrCreatePerson
              isRequired={false}
              label="Beneficiario (Opcional)"
              personId={personId}
              setPersonId={setPersonId}
              setSelectedPerson={setSelectedPerson}
            />

            <SelectOrCreatePerson
              isRequired={false}
              label="Pagador (Opcional)"
              personId={payerPersonId}
              setPersonId={setPayerPersonId}
              setSelectedPerson={setSelectedPayerPerson}
            />

            <ComboBox
              className="w-full"
              variant="secondary"
              menuTrigger="focus"
              selectedKey={categoryId}
              onSelectionChange={(key) => {
                if (key) setCategoryId(key as string);
              }}
              isRequired
            >
              <Label className="text-sm font-semibold">Categoría</Label>
              <ComboBox.InputGroup>
                <Input
                  variant="secondary"
                  placeholder="Seleccione una categoría"
                />
                <ComboBox.Trigger />
              </ComboBox.InputGroup>
              <ComboBox.Popover>
                <ListBox>
                  {categories.map((cat) => (
                    <ListBox.Item key={cat.id} id={cat.id} textValue={cat.name}>
                      {cat.name}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </ComboBox.Popover>
            </ComboBox>

            <ComboBox
              className="w-full"
              variant="secondary"
              aria-label="Seleccionar cuenta financiera"
              menuTrigger="focus"
              selectedKey={financialAccountId}
              onSelectionChange={(key) => {
                if (key) {
                  setFinancialAccountId(key as string);
                  const selectedAcc = financialAccounts.find((a) => a.id === key);
                  if (selectedAcc && selectedAcc.allowedPaymentMethods && selectedAcc.allowedPaymentMethods.length > 0) {
                    if (!selectedAcc.allowedPaymentMethods.includes(paymentMethod)) {
                      setPaymentMethod(selectedAcc.allowedPaymentMethods[0]);
                    }
                  } else {
                    setPaymentMethod("");
                  }
                }
              }}
              isRequired
            >
              <Label className="mb-1 text-sm font-semibold">
                Cuenta Financiera
              </Label>
              <ComboBox.InputGroup>
                <Input variant="secondary" placeholder="Seleccione cuenta" />
                <ComboBox.Trigger />
              </ComboBox.InputGroup>
              <ComboBox.Popover>
                <ListBox items={financialAccounts}>
                  {(item: FinancialAccount) => (
                    <ListBox.Item
                      key={item.id}
                      id={item.id}
                      textValue={item.name}
                    >
                      <div className="flex flex-col">
                        <span className="text-small">{item.name}</span>
                        <span className="text-tiny text-default-400">
                          {item.type} • {item.currency}
                        </span>
                      </div>
                    </ListBox.Item>
                  )}
                </ListBox>
              </ComboBox.Popover>
            </ComboBox>

            {(() => {
              const selectedAcc = financialAccounts.find(
                (a) => a.id === financialAccountId,
              );
              const hasMethods =
                selectedAcc &&
                selectedAcc.allowedPaymentMethods &&
                selectedAcc.allowedPaymentMethods.length > 0;
              return (
                <div className="w-full">
                  <ComboBox
                    className="w-full"
                    variant="secondary"
                    menuTrigger="focus"
                    selectedKey={paymentMethod}
                    isDisabled={!hasMethods}
                    onSelectionChange={(key) => {
                      if (key) setPaymentMethod(key as string);
                    }}
                    isRequired
                  >
                    <Label className="text-sm font-semibold">Método de Pago</Label>
                    <ComboBox.InputGroup>
                      <Input
                        variant="secondary"
                        placeholder="Seleccione el método de pago"
                      />
                      <ComboBox.Trigger />
                    </ComboBox.InputGroup>
                    <ComboBox.Popover>
                      <ListBox>
                        {(selectedAcc?.allowedPaymentMethods || []).map(
                          (method) => (
                            <ListBox.Item
                              key={method}
                              id={method}
                              textValue={PAYMENT_METHOD_LABELS[method] || method}
                            >
                              {PAYMENT_METHOD_LABELS[method] || method}
                            </ListBox.Item>
                          ),
                        )}
                      </ListBox>
                    </ComboBox.Popover>
                  </ComboBox>
                  {!hasMethods && financialAccountId && (
                    <p className="text-xs text-danger mt-1">
                      Esta cuenta no puede recibir pagos.
                    </p>
                  )}
                </div>
              );
            })()}

            {type === "EXPENSE" && (
              <div className="w-full flex flex-col gap-2 mt-2">
                <Label className="text-sm font-semibold">
                  Comprobantes (Opcional)
                </Label>
                <FileUploader
                  files={files}
                  onFilesChange={setFiles}
                  maxFiles={3}
                />
              </div>
            )}
          </Drawer.Body>
          <Drawer.Footer className="border-t border-border">
            <Button
              variant="outline"
              onPress={() => onOpenChange(false)}
              isDisabled={isLoading || isUploading}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
              Cancelar
            </Button>
            <Button
              variant="primary"
              onPress={handleSubmit}
              isPending={isLoading || isUploading}
            >
              {!isLoading && !isUploading && (
                <HugeiconsIcon icon={FloppyDiskIcon} size={18} />
              )}
              Registrar {type === "INCOME" ? "Ingreso" : "Egreso"}
            </Button>
          </Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>

      <PrintReportDialog
        transactionId={printTransactionId}
        isOpen={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        onSuccess={() => {
          onOpenChange(false);
          onSuccess?.();
        }}
      />
    </>
  );
};
