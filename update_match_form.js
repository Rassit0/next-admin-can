const fs = require('fs');
let code = fs.readFileSync('src/modules/calendar/components/match-form-modal.tsx', 'utf-8');

// Replace state variables
code = code.replace(
  'const [teamSeasonCategoryId, setTeamSeasonCategoryId] = useState("");',
  'const [homeTeamSeasonCategoryId, setHomeTeamSeasonCategoryId] = useState("");\n  const [awayTeamSeasonCategoryId, setAwayTeamSeasonCategoryId] = useState("");'
);

// Replace MatchInitialData interface
code = code.replace(
  '  teamSeasonCategoryId: string;',
  '  homeTeamSeasonCategoryId?: string | null;\n  awayTeamSeasonCategoryId?: string | null;'
);

// Replace useEffect initial load
code = code.replace(
  'setTeamSeasonCategoryId(initialData.teamSeasonCategoryId);',
  'setHomeTeamSeasonCategoryId(initialData.homeTeamSeasonCategoryId || "");\n        setAwayTeamSeasonCategoryId(initialData.awayTeamSeasonCategoryId || "");'
);

// Replace resetForm
code = code.replace(
  'setTeamSeasonCategoryId("");',
  'setHomeTeamSeasonCategoryId("");\n    setAwayTeamSeasonCategoryId("");'
);

// Filter categories
code = code.replace(
  /const filteredCategories = useMemo[\s\S]*?\}, \[categories, teams, disciplineFilter, homeTeamId, awayTeamId\]\);/m,
  `const homeCategories = useMemo(() => {
    if (!homeTeamId) return [];
    return categories.filter((c) => c.teamId === homeTeamId);
  }, [categories, homeTeamId]);

  const awayCategories = useMemo(() => {
    if (!awayTeamId) return [];
    return categories.filter((c) => c.teamId === awayTeamId);
  }, [categories, awayTeamId]);`
);

// Remove UX Mejora legacy code
code = code.replace(
  /  \/\/ UX Mejora: Indicar qué equipo corresponde a la categoría CAN\n  const selectedCategory = categories\.find\([\s\S]*?\);\n  const selectedCategoryTeamId = selectedCategory\?\.teamId;\n/m,
  ''
);

code = code.replace(
  /    teamSeasonCategoryId,\n    selectedCategoryTeamId,/m,
  '    homeTeamSeasonCategoryId,\n    awayTeamSeasonCategoryId,'
);

// Replace discipline filter reset
code = code.replace(
  'setTeamSeasonCategoryId("");',
  'setHomeTeamSeasonCategoryId("");\n                    setAwayTeamSeasonCategoryId("");'
);

// Replace handleSubmit validation
const oldSubmitStart = `    if (
      !homeTeamId ||
      !awayTeamId ||
      !teamSeasonCategoryId ||
      !startDate ||
      !endDate
    ) {
      setApiError("Por favor complete los campos obligatorios.");
      return;
    }

    if (homeTeamId === awayTeamId) {
      setApiError("El equipo local no puede ser igual al visitante.");
      return;
    }`;

const newSubmitStart = `    if (
      !homeTeamId ||
      !awayTeamId ||
      !startDate ||
      !endDate
    ) {
      setApiError("Por favor complete los campos obligatorios (equipos y fechas).");
      return;
    }

    if (homeTeamId === awayTeamId) {
      if (!homeTeamSeasonCategoryId || !awayTeamSeasonCategoryId || homeTeamSeasonCategoryId === awayTeamSeasonCategoryId) {
        setApiError("Un equipo no puede jugar contra sí mismo en la misma categoría.");
        return;
      }
    }`;
code = code.replace(oldSubmitStart, newSubmitStart);

// Replace payload
code = code.replace(
  'teamSeasonCategoryId,',
  'homeTeamSeasonCategoryId: homeTeamSeasonCategoryId || null,\n      awayTeamSeasonCategoryId: awayTeamSeasonCategoryId || null,'
);

// Remove the single Select for teamSeasonCategoryId and add two Selects
const oldCategorySelect = `                <Select
                  variant="secondary"
                  value={teamSeasonCategoryId}
                  onChange={(value) => setTeamSeasonCategoryId(value as string)}
                  isDisabled={loadingData || !disciplineFilter}
                >
                  <Label className="font-semibold text-sm">
                    Categoría de Temporada CAN *
                  </Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox items={filteredCategories}>
                      {(c) => (
                        <ListBox.Item
                          id={c.id}
                          textValue={\`\${c.name} (\${c.gender})\`}
                        >
                          <div className="flex flex-col">
                            <span>
                              {c.name} ({c.gender})
                            </span>
                            <span className="text-xs text-muted">
                              {c.seasonName}
                            </span>
                          </div>
                        </ListBox.Item>
                      )}
                    </ListBox>
                  </Select.Popover>
                </Select>

                {selectedCategoryTeamId &&
                  selectedCategoryTeamId !== homeTeamId &&
                  selectedCategoryTeamId !== awayTeamId && (
                    <p className="text-xs text-danger -mt-3">
                      El equipo de la categoría CAN seleccionada debe participar
                      como Local o Visitante.
                    </p>
                  )}`;

const newCategorySelects = `                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    variant="secondary"
                    value={homeTeamSeasonCategoryId}
                    onChange={(value) => setHomeTeamSeasonCategoryId(value as string)}
                    isDisabled={loadingData || !homeTeamId || homeCategories.length === 0}
                  >
                    <Label className="font-semibold text-sm">
                      Categoría Local (Opcional)
                    </Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox items={homeCategories}>
                        {(c) => (
                          <ListBox.Item id={c.id} textValue={\`\${c.name} (\${c.gender})\`}>
                            <div className="flex flex-col">
                              <span>{c.name} ({c.gender})</span>
                              <span className="text-xs text-muted">{c.seasonName}</span>
                            </div>
                          </ListBox.Item>
                        )}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <Select
                    variant="secondary"
                    value={awayTeamSeasonCategoryId}
                    onChange={(value) => setAwayTeamSeasonCategoryId(value as string)}
                    isDisabled={loadingData || !awayTeamId || awayCategories.length === 0}
                  >
                    <Label className="font-semibold text-sm">
                      Categoría Visitante (Opcional)
                    </Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox items={awayCategories}>
                        {(c) => (
                          <ListBox.Item id={c.id} textValue={\`\${c.name} (\${c.gender})\`}>
                            <div className="flex flex-col">
                              <span>{c.name} ({c.gender})</span>
                              <span className="text-xs text-muted">{c.seasonName}</span>
                            </div>
                          </ListBox.Item>
                        )}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>`;

code = code.replace(oldCategorySelect, newCategorySelects);

// Remove selectedCategoryTeamId from team option renders
code = code.replace(
  /                              \{selectedCategoryTeamId === t\.id && \(\s*<span className="text-xs bg-primary\/20 text-primary px-2 py-0\.5 rounded">\s*CAN\s*<\/span>\s*\)\}/g,
  ''
);

// Remove the disabled state logic based on selectedCategoryTeamId in the submit button
code = code.replace(
  /                  \(selectedCategoryTeamId !== undefined &&\s*selectedCategoryTeamId !== homeTeamId &&\s*selectedCategoryTeamId !== awayTeamId\)/g,
  'false'
);

fs.writeFileSync('src/modules/calendar/components/match-form-modal.tsx', code);
console.log("Done updating match-form-modal.tsx");
