"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { NavGroupKey } from "@/ui/interfaces/sidebar/sidebar";

const SIDEBAR_COLLAPSED_STORAGE_KEY = "can-admin-sidebar-collapsed";
const LEGACY_SIDEBAR_GROUPS_STORAGE_KEY = "can-admin-sidebar-collapsed-groups";

const EMPTY_GROUPS: NavGroupKey[] = [];

const collapsedListeners = new Set<() => void>();
const openGroupListeners = new Set<() => void>();
let collapsedStorageAttached = false;
let legacyGroupsCleaned = false;
let manualOpenGroupsSnapshot: NavGroupKey[] = EMPTY_GROUPS;

function emitCollapsedChange() {
  collapsedListeners.forEach((listener) => listener());
}

function emitOpenGroupsChange() {
  openGroupListeners.forEach((listener) => listener());
}

function subscribeSidebarCollapsed(listener: () => void) {
  collapsedListeners.add(listener);

  if (typeof window !== "undefined" && !collapsedStorageAttached) {
    collapsedStorageAttached = true;
    window.addEventListener("storage", (event) => {
      if (event.key === SIDEBAR_COLLAPSED_STORAGE_KEY) {
        emitCollapsedChange();
      }
    });
  }

  return () => {
    collapsedListeners.delete(listener);
  };
}

function subscribeManualOpenGroups(listener: () => void) {
  openGroupListeners.add(listener);
  return () => {
    openGroupListeners.delete(listener);
  };
}

function getCollapsedSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getCollapsedServerSnapshot(): boolean {
  return false;
}

function getManualOpenGroupsSnapshot(): NavGroupKey[] {
  return manualOpenGroupsSnapshot;
}

function getManualOpenGroupsServerSnapshot(): NavGroupKey[] {
  return EMPTY_GROUPS;
}

export function cleanupLegacySidebarGroupsPreference() {
  if (typeof window === "undefined" || legacyGroupsCleaned) return;
  legacyGroupsCleaned = true;
  try {
    window.localStorage.removeItem(LEGACY_SIDEBAR_GROUPS_STORAGE_KEY);
  } catch {
    // Ignore storage access errors
  }
}

export function setSidebarCollapsedPreference(collapsed: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SIDEBAR_COLLAPSED_STORAGE_KEY,
      collapsed ? "1" : "0",
    );
  } catch {
    // Ignore storage quota/private mode errors
  }
  emitCollapsedChange();
}

export function setSidebarManualOpenGroups(groups: NavGroupKey[]) {
  manualOpenGroupsSnapshot = groups.length === 0 ? EMPTY_GROUPS : [...groups];
  emitOpenGroupsChange();
}

export function resetSidebarOpenGroups() {
  legacyGroupsCleaned = false;
  manualOpenGroupsSnapshot = EMPTY_GROUPS;
  emitOpenGroupsChange();
}

export function useSidebarCollapsed() {
  const isCollapsed = useSyncExternalStore(
    subscribeSidebarCollapsed,
    getCollapsedSnapshot,
    getCollapsedServerSnapshot,
  );

  const toggleCollapsed = useCallback(() => {
    setSidebarCollapsedPreference(!getCollapsedSnapshot());
  }, []);

  return {
    isCollapsed,
    toggleCollapsed,
    setCollapsed: setSidebarCollapsedPreference,
  };
}

/**
 * Controla qué secciones del Sidebar fueron abiertas manualmente en la sesión actual.
 * Todas las secciones inician cerradas por defecto (`[]`) tras carga o recarga.
 */
export function useSidebarOpenGroups() {
  useEffect(() => {
    cleanupLegacySidebarGroupsPreference();
  }, []);

  const manualOpenGroups = useSyncExternalStore(
    subscribeManualOpenGroups,
    getManualOpenGroupsSnapshot,
    getManualOpenGroupsServerSnapshot,
  );

  const toggleGroup = useCallback((groupKey: NavGroupKey) => {
    const current = getManualOpenGroupsSnapshot();
    const exists = current.includes(groupKey);
    const next = exists
      ? current.filter((key) => key !== groupKey)
      : [...current, groupKey];
    setSidebarManualOpenGroups(next);
  }, []);

  const openGroup = useCallback((groupKey: NavGroupKey) => {
    const current = getManualOpenGroupsSnapshot();
    if (!current.includes(groupKey)) {
      setSidebarManualOpenGroups([...current, groupKey]);
    }
  }, []);

  const closeGroup = useCallback((groupKey: NavGroupKey) => {
    const current = getManualOpenGroupsSnapshot();
    if (current.includes(groupKey)) {
      setSidebarManualOpenGroups(current.filter((key) => key !== groupKey));
    }
  }, []);

  return {
    manualOpenGroups,
    toggleGroup,
    openGroup,
    closeGroup,
  };
}
