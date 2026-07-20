"use client";
import { Avatar, Button, Checkbox, Chip, Table } from "@heroui/react";
import { EyeIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { ButtonGestion } from "./ButtonGestion";
import { EditModal } from "../modal/EditModal";
import { SortableColumnHeader } from "@/ui";
import { DeleteModal } from "../modal/DeleteModal";
import { iconMap } from "@/utils";
import { IPaymentPlan } from "@/modules/payment-plans";

interface Props {
  paymentPlans: IPaymentPlan[];
  teamSeasonId?: string;
  courseSeasonId?: string;
  teamSeasonBillingType?: string;
  courseSeasonBillingType?: string;
}

export const TablePaymentPlans = ({
  paymentPlans,
  teamSeasonId,
  courseSeasonId,
  teamSeasonBillingType,
  courseSeasonBillingType,
}: Props) => {
  const [isClient, setIsClient] = useState(false);

  // Evitamos la hidratación fallida
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // O un esqueleto de carga (Skeleton)
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Table with custom cells"
          className="min-w-200"
        >
          <Table.Header>
            {/* <Table.Column
              allowsSorting
              isRowHeader
              className="after:hidden"
              id="id"
            >
              ID
            </Table.Column> */}

            <Table.Column isRowHeader allowsSorting id="name">
              <SortableColumnHeader id="name">
                PLAN DE PAGO
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="registrationDiscountPercent">
              <SortableColumnHeader id="registrationDiscountPercent">
                DESCUENTO REGISTRO
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="recurringDiscountPercent">
              <SortableColumnHeader id="recurringDiscountPercent">
                DESCUENTO MENSUAL
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="createdAt">
              <SortableColumnHeader id="createdAt">
                CREADO EN
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="updatedAt">
              <SortableColumnHeader id="updatedAt">
                ACTUALIZADO EN
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column className="text-center">ACCIONES</Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-default-100 text-default-500">
                  <HugeiconsIcon icon={Search01Icon} className="size-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-medium font-medium">
                    No se encontraron registros
                  </span>
                  <span className="text-sm text-default-400">
                    Intenta con otros términos de búsqueda o agrega uno nuevo.
                  </span>
                </div>
              </div>
            )}
          >
            {paymentPlans.map((paymentPlan) => (
              <Table.Row key={paymentPlan.id} id={paymentPlan.id}>
                {/* <Table.Cell>{category.id}</Table.Cell> */}
                <Table.Cell>{paymentPlan.name}</Table.Cell>
                <Table.Cell>
                  {paymentPlan.registrationDiscountPercent} %
                </Table.Cell>
                <Table.Cell>
                  {paymentPlan.recurringDiscountPercent} %
                </Table.Cell>
                <Table.Cell>
                  {paymentPlan.createdAt.toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {paymentPlan.updatedAt.toLocaleDateString()}
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <Button isIconOnly size="sm" variant="tertiary">
                      <HugeiconsIcon icon={EyeIcon} />
                    </Button>
                    <EditModal
                      paymentPlan={paymentPlan}
                      teamSeasonId={teamSeasonId}
                      courseSeasonId={courseSeasonId}
                      teamSeasonBillingType={teamSeasonBillingType}
                      courseSeasonBillingType={courseSeasonBillingType}
                      isIcon={true}
                    />
                    {/* <DeleteModal paymentPlan={paymentPlan} isIcon={true} /> */}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
