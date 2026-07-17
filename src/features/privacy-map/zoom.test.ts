import { describe, expect, it } from "vitest";
import {
  initialPrivacyMapState,
  MAX_PRECISION,
  PRECISION_LEVELS,
  precisionLevel,
  refusalMessage,
  zoomIn,
  zoomOut,
} from "@/features/privacy-map/zoom";

describe("privacy map zoom", () => {
  it("starts one step below the precision limit with no refusals", () => {
    expect(initialPrivacyMapState.precision).toBe(MAX_PRECISION - 1);
    expect(refusalMessage(initialPrivacyMapState)).toBeNull();
  });

  it("zooms in until the precision limit, then refuses instead", () => {
    const atLimit = zoomIn(initialPrivacyMapState);
    expect(atLimit.precision).toBe(MAX_PRECISION);
    expect(atLimit.refusals).toBe(0);

    const refused = zoomIn(atLimit);
    expect(refused.precision).toBe(MAX_PRECISION);
    expect(refused.refusals).toBe(1);
  });

  it("escalates the refusal message and stops escalating eventually", () => {
    let state = zoomIn(initialPrivacyMapState);
    const messages: (string | null)[] = [];
    for (let attempt = 0; attempt < 6; attempt += 1) {
      state = zoomIn(state);
      messages.push(refusalMessage(state));
    }

    expect(messages[0]).toBe("Precision limit reached. Privacy layer enabled.");
    expect(messages[1]).toBe("The privacy layer remains enabled.");
    expect(messages[4]).toBe(messages[5]);
    expect(state.precision).toBe(MAX_PRECISION);
  });

  it("zooms out to the widest level and clamps there", () => {
    let state = initialPrivacyMapState;
    for (let step = 0; step < PRECISION_LEVELS.length + 2; step += 1) {
      state = zoomOut(state);
    }

    expect(state.precision).toBe(0);
    expect(precisionLevel(state).name).toBe("Western Europe");
  });

  it("withdraws the privacy layer when zooming back out, but remembers attempts", () => {
    const refused = zoomIn(zoomIn(initialPrivacyMapState));
    const backedOut = zoomOut(refused);

    expect(backedOut.refusals).toBe(1);
    expect(refusalMessage(backedOut)).toBeNull();

    const refusedAgain = zoomIn(zoomIn(backedOut));
    expect(refusalMessage(refusedAgain)).toBe(
      "The privacy layer remains enabled.",
    );
  });
});
