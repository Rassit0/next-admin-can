'use client';

import { useState, useEffect } from 'react';
import { Select, ListBox, Card, Label, Key } from '@heroui/react';
import { getCourseSeasonShiftMatrix } from '../actions/payments-matrix';
import { PaymentsMatrixResponse } from '../types/payments-matrix.type';
import { PaymentMatrixTable } from './PaymentMatrixTable';

interface CourseSeasonPaymentsMatrixProps {
  shifts: {
    id: string;
    shift: {
      name: string;
    };
    category?: {
      name: string;
    } | null;
  }[];
}

export function CourseSeasonPaymentsMatrix({ shifts }: CourseSeasonPaymentsMatrixProps) {
  const [selectedShiftId, setSelectedShiftId] = useState<string>(shifts.length > 0 ? shifts[0].id : '');
  const [data, setData] = useState<PaymentsMatrixResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedShiftId) {
      setData(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getCourseSeasonShiftMatrix(selectedShiftId)
      .then((res) => {
        if (isMounted) {
          if (res.error) {
            setError(res.message || 'Error al cargar la matriz');
          } else {
            setData(res.data || null);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError(err.message || 'Error al cargar la matriz');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedShiftId]);

  if (shifts.length === 0) {
    return (
      <Card className="w-full p-10 flex flex-col items-center">
        <p className="text-default-500">Esta temporada no tiene turnos configurados.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full max-w-sm">
        <Select
          value={selectedShiftId as Key}
          onChange={(val) => {
            const strVal = val?.toString();
            if (strVal) setSelectedShiftId(strVal);
          }}
        >
          <Label>Seleccionar Turno</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {shifts.map((s) => (
                <ListBox.Item key={s.id} id={s.id} textValue={`${s.shift.name}${s.category ? ` - ${s.category.name}` : ''}`}>
                  {`${s.shift.name}${s.category ? ` - ${s.category.name}` : ''}`}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <PaymentMatrixTable 
        data={data} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}
