import {
  clampSheetDragOffset,
  classifySheetDragDirection,
  SHEET_CLOSE_DISTANCE_PX,
  SHEET_CLOSE_FLICK_MIN_DISTANCE_PX,
  shouldCloseSheetOnRelease,
} from "./sheet-gesture";

describe("sheet-gesture", () => {
  describe("classifySheetDragDirection", () => {
    it("remains pending below the axis lock threshold", () => {
      expect(classifySheetDragDirection(3, 5)).toBe("pending");
      expect(classifySheetDragDirection(-6, -4)).toBe("pending");
    });

    it("locks drag-down when downward vertical movement dominates", () => {
      expect(classifySheetDragDirection(2, 14)).toBe("drag-down");
      expect(classifySheetDragDirection(-5, 10)).toBe("drag-down");
    });

    it("cancels when dragging upward (list scroll) or mostly horizontally", () => {
      expect(classifySheetDragDirection(0, -14)).toBe("cancel");
      expect(classifySheetDragDirection(16, 10)).toBe("cancel");
      expect(classifySheetDragDirection(-20, 12)).toBe("cancel");
    });
  });

  describe("clampSheetDragOffset", () => {
    it("never allows negative upward offsets", () => {
      expect(clampSheetDragOffset(-30)).toBe(0);
      expect(clampSheetDragOffset(0)).toBe(0);
      expect(clampSheetDragOffset(42)).toBe(42);
    });
  });

  describe("shouldCloseSheetOnRelease", () => {
    it("closes when dragged past the distance threshold regardless of slow speed", () => {
      expect(
        shouldCloseSheetOnRelease({
          offsetY: SHEET_CLOSE_DISTANCE_PX,
          elapsedMs: 900,
        }),
      ).toBe(true);
    });

    it("closes on fast downward flick above minimum flick distance", () => {
      expect(
        shouldCloseSheetOnRelease({
          offsetY: SHEET_CLOSE_FLICK_MIN_DISTANCE_PX + 8,
          elapsedMs: 60, // ~0.73 px/ms >= 0.45
        }),
      ).toBe(true);
    });

    it("keeps sheet open on slow short drags or zero offset", () => {
      expect(
        shouldCloseSheetOnRelease({
          offsetY: SHEET_CLOSE_FLICK_MIN_DISTANCE_PX + 10,
          elapsedMs: 500, // ~0.09 px/ms < 0.45 and < 96px
        }),
      ).toBe(false);
      expect(
        shouldCloseSheetOnRelease({
          offsetY: 0,
          elapsedMs: 20,
        }),
      ).toBe(false);
    });
  });
});

