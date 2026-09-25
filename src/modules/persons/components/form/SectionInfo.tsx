import { Checkbox, FieldError, Label, ListBox, Select } from "@heroui/react";
import { CameraAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useState } from "react";

export const SectionInfo = () => {
  const [isStandardSize, setIsStandardSize] = useState(false);
  return (
    <div className="w-full md:w-1/3 p-8 border-r border-outline-variant/15  space-y-8 bg-surface-container-low/30">
      <section>
        <h3 className="text-xs font-black text-sky-700 uppercase tracking-widest mb-6">
          Información Básica
        </h3>
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-lg bg-surface-container-high border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden">
              <HugeiconsIcon
                icon={CameraAdd01Icon}
                className="text-4xl text-outline"
              />
            </div>
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center cursor-pointer">
              <span className="text-white text-[10px] font-bold uppercase">
                Cargar
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
              Nombre Completo
            </label>
            <input
              className="w-full px-4 py-2.5 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm"
              placeholder="Ej: Santiago Arias"
              type="text"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
              Documento de Identidad
            </label>
            <input
              className="w-full px-4 py-2.5 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm"
              placeholder="ID Number"
              type="text"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
              Fecha de Nacimiento
            </label>
            <input
              className="w-full px-4 py-2.5 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm"
              type="date"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-4 pt-2">
          <Checkbox
            id="is-standard-size"
            isSelected={isStandardSize}
            onChange={setIsStandardSize}
            variant="secondary"
          >
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label htmlFor="is-standard-size">Talla Estandar</Label>
            </Checkbox.Content>
          </Checkbox>
          {isStandardSize && (
            <Select
              isRequired
              className="w-full"
              name="standardSize"
              placeholder="Select one"
              variant="secondary"
            >
              <Label>Talla</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="XS" textValue="XS">
                    XS
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="S" textValue="S">
                    S
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="M" textValue="M">
                    M
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="L" textValue="L">
                    L
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="XL" textValue="XL">
                    XL
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="XXL" textValue="XXL">
                    XXL
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="XXXL" textValue="XXXL">
                    XXXL
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
              <FieldError />
            </Select>
          )}
        </div>
      </section>
      <section>
        <h3 className="text-xs font-black text-sky-700 uppercase tracking-widest mb-6">
          Contacto y Emergencia
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
              Correo Electrónico
            </label>
            <input
              className="w-full px-4 py-2.5 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm"
              placeholder="email@atletico.co"
              type="email"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
              Teléfono de Contacto
            </label>
            <input
              className="w-full px-4 py-2.5 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm"
              placeholder="+57 300 000 0000"
              type="tel"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
