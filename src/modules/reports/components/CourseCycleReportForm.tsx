"use client";
import { useState, useEffect } from "react";
import type { Key } from "@heroui/react";
import { Select, ListBox, Label, Spinner } from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { Collection, ListBoxLoadMoreItem } from "react-aria-components";
import {
  getDisciplinesOptionsAction,
  getSchoolsOptionsAction,
  getCourseSeasonsPaginatedAction,
  getCourseSeasonShiftsOptionsAction,
  getCyclesOptionsAction,
} from "../actions/report-options.actions";
import { DownloadReportButton } from "./DownloadReportButton";

export function CourseCycleReportForm() {
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);

  const [disciplineId, setDisciplineId] = useState<Key | null>(null);
  const [schoolId, setSchoolId] = useState<Key | null>(null);
  const [courseSeasonId, setCourseSeasonId] = useState<Key | null>(null);
  const [courseSeasonShiftId, setCourseSeasonShiftId] = useState<Key | null>(
    null,
  );
  const [cycleIndex, setCycleIndex] = useState<Key | null>(null);

  const [isLoading, setIsLoading] = useState({
    disciplines: true,
    schools: false,
    shifts: false,
    cycles: false,
  });

  const seasonsList = useAsyncList({
    async load({ cursor, signal }) {
      if (!schoolId) return { items: [] };
      const page = cursor ? Number(cursor) : 1;
      const res = await getCourseSeasonsPaginatedAction(
        schoolId as string,
        page,
      );
      return {
        items: res?.data?.items || [],
        cursor: res?.data?.nextPage,
      };
    },
  });

  useEffect(() => {
    getDisciplinesOptionsAction().then((res) => {
      setDisciplines(res.data || []);
      setIsLoading((prev) => ({ ...prev, disciplines: false }));
    });
  }, []);

  useEffect(() => {
    if (!disciplineId) {
      setSchools([]);
      setSchoolId(null);
      return;
    }
    setIsLoading((prev) => ({ ...prev, schools: true }));
    getSchoolsOptionsAction(disciplineId as string).then((res) => {
      setSchools(res.data || []);
      setIsLoading((prev) => ({ ...prev, schools: false }));
    });
  }, [disciplineId]);

  useEffect(() => {
    seasonsList.reload();
    setCourseSeasonId(null);
  }, [schoolId]);

  useEffect(() => {
    if (!courseSeasonId) {
      setShifts([]);
      setCourseSeasonShiftId(null);
      return;
    }
    setIsLoading((prev) => ({ ...prev, shifts: true }));
    getCourseSeasonShiftsOptionsAction(courseSeasonId as string).then((res) => {
      setShifts(res.data || []);
      setIsLoading((prev) => ({ ...prev, shifts: false }));
    });
  }, [courseSeasonId]);

  useEffect(() => {
    if (!courseSeasonShiftId) {
      setCycles([]);
      setCycleIndex(null);
      return;
    }
    setIsLoading((prev) => ({ ...prev, cycles: true }));
    getCyclesOptionsAction(courseSeasonShiftId as string).then((res) => {
      setCycles(res.data || []);
      setIsLoading((prev) => ({ ...prev, cycles: false }));
    });
  }, [courseSeasonShiftId]);

  const selectedCycle = cycleIndex !== null ? cycles[Number(cycleIndex)] : null;
  const isFormValid =
    disciplineId && schoolId && courseSeasonShiftId && selectedCycle;

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-default-50 max-w-xl shadow-sm">
      <h3 className="text-lg font-semibold text-primary">
        Generar Lista de Inscritos Escuela
      </h3>
      <p className="text-sm text-default-500 mb-4">
        Selecciona los filtros secuencialmente para habilitar la descarga del
        reporte.
      </p>

      {/* Select Disciplina */}
      <Select
        className="w-full"
        placeholder="Selecciona una disciplina"
        value={disciplineId}
        onChange={(val) => setDisciplineId(val)}
        isDisabled={isLoading.disciplines}
      >
        <Label>
          Disciplina {isLoading.disciplines && <Spinner size="sm" />}
        </Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {disciplines.map((d) => (
              <ListBox.Item key={d.id} id={d.id} textValue={d.name}>
                {d.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {/* Select Escuela */}
      <Select
        className="w-full"
        placeholder="Selecciona una escuela"
        value={schoolId}
        onChange={(val) => setSchoolId(val)}
        isDisabled={!disciplineId || isLoading.schools}
      >
        <Label>Escuela {isLoading.schools && <Spinner size="sm" />}</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {schools.map((s) => (
              <ListBox.Item key={s.id} id={s.id} textValue={s.name}>
                {s.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {/* Select Temporada */}
      <Select
        className="w-full"
        placeholder="Selecciona una oferta"
        value={courseSeasonId}
        onChange={(val) => setCourseSeasonId(val)}
        isDisabled={!schoolId || seasonsList.isLoading}
      >
        <Label>
          Oferta Deportiva (Temporada){" "}
          {seasonsList.isLoading && <Spinner size="sm" />}
        </Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <Collection items={seasonsList.items}>
              {(item: any) => (
                <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                  {item.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              )}
            </Collection>
            {/* <ListBoxLoadMoreItem
              isLoading={seasonsList.loadingState === "loadingMore"}
              onLoadMore={seasonsList.loadMore}
            >
              <div className="flex items-center justify-center gap-2 py-2">
                <Spinner size="sm" />
                <span className="text-sm text-default-500">
                  Cargando más...
                </span>
              </div>
            </ListBoxLoadMoreItem> */}
          </ListBox>
        </Select.Popover>
      </Select>

      {/* Select Turno */}
      <Select
        className="w-full"
        placeholder="Selecciona un turno"
        value={courseSeasonShiftId}
        onChange={(val) => setCourseSeasonShiftId(val)}
        isDisabled={!courseSeasonId || isLoading.shifts}
      >
        <Label>Turno {isLoading.shifts && <Spinner size="sm" />}</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {shifts.map((s) => (
              <ListBox.Item key={s.id} id={s.id} textValue={s.name}>
                {s.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {/* Select Ciclo */}
      <Select
        className="w-full"
        placeholder="Selecciona el ciclo a reportar"
        value={cycleIndex}
        onChange={(val) => {
          console.log("SELECT CICLO ONCHANGE:", val, typeof val);
          setCycleIndex(val as any);
        }}
        isDisabled={!courseSeasonShiftId || isLoading.cycles}
      >
        <Label>Ciclo {isLoading.cycles && <Spinner size="sm" />}</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {cycles.map((c, idx) => (
              <ListBox.Item
                key={idx.toString()}
                id={idx.toString()}
                textValue={c.name}
              >
                {c.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <div className="mt-4 pt-4 border-t">
        {isFormValid ? (
          <DownloadReportButton
            reportId="course.cycle-enrollment"
            params={{
              disciplineId: disciplineId as string,
              schoolId: schoolId as string,
              courseSeasonId: courseSeasonId as string,
              courseSeasonShiftId: courseSeasonShiftId as string,
              cycleStartDate: selectedCycle.cycleStartDate,
              cycleEndDate: selectedCycle.cycleEndDate,
            }}
            label="Descargar Reporte"
          />
        ) : (
          <div className="text-sm text-warning-500 bg-warning-50 p-3 rounded-md">
            Completa todos los campos para habilitar la descarga. Si no aparecen
            ciclos, es posible que no existan inscritos en este turno.
          </div>
        )}
      </div>
    </div>
  );
}
