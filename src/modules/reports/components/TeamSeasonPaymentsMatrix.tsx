'use client';

import { useState, useEffect } from 'react';
import { getTeamSeasonMatrix } from '../actions/payments-matrix';
import { PaymentsMatrixResponse } from '../types/payments-matrix.type';
import { PaymentMatrixTable } from './PaymentMatrixTable';

interface TeamSeasonPaymentsMatrixProps {
  teamSeasonId: string;
  teamSeasonCategoryId?: string;
}

export function TeamSeasonPaymentsMatrix({ teamSeasonId, teamSeasonCategoryId }: TeamSeasonPaymentsMatrixProps) {
  const [data, setData] = useState<PaymentsMatrixResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getTeamSeasonMatrix(teamSeasonId, teamSeasonCategoryId)
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
  }, [teamSeasonId, teamSeasonCategoryId]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <PaymentMatrixTable 
        data={data} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}
