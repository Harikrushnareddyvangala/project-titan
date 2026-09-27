import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createAuthenticatedFetcher,
  UnauthenticatedBrowserRequestError,
} from "./authenticated-fetch";

describe("createAuthenticatedFetcher", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("adds the Cognito access token as a bearer authorization header", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ ok: true })));

    const fetcher = createAuthenticatedFetcher({
      accessToken: "example-access-token",
      expiresAt: Date.now() + 60_000,
    });

    await fetcher("/api/research/example");

    expect(fetchMock).toHaveBeenCalledOnce();

    const [, init] = fetchMock.mock.calls[0];

    expect(new Headers(init?.headers).get("Authorization")).toBe(
      "Bearer example-access-token",
    );
  });

  it("preserves existing headers and request options", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("ok"));

    const fetcher = createAuthenticatedFetcher({
      accessToken: "example-access-token",
      expiresAt: Date.now() + 60_000,
    });

    await fetcher("/api/research/example", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-TITAN-Test": "preserved",
      },
      body: JSON.stringify({ example: true }),
    });

    const [input, init] = fetchMock.mock.calls[0];

    expect(input).toBe("/api/research/example");
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(JSON.stringify({ example: true }));

    const headers = new Headers(init?.headers);

    expect(headers.get("Authorization")).toBe(
      "Bearer example-access-token",
    );
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(headers.get("X-TITAN-Test")).toBe("preserved");
  });

  it("rejects a missing session without making a request", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("ok"));

    const fetcher = createAuthenticatedFetcher(null);

    await expect(fetcher("/api/research/example")).rejects.toBeInstanceOf(
      UnauthenticatedBrowserRequestError,
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an expired session without making a request", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("ok"));

    const fetcher = createAuthenticatedFetcher({
      accessToken: "expired-access-token",
      expiresAt: Date.now() - 1,
    });

    await expect(fetcher("/api/research/example")).rejects.toBeInstanceOf(
      UnauthenticatedBrowserRequestError,
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not overwrite an explicitly supplied Authorization header silently", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("ok"));

    const fetcher = createAuthenticatedFetcher({
      accessToken: "example-access-token",
      expiresAt: Date.now() + 60_000,
    });

    await fetcher("/api/research/example", {
      headers: {
        Authorization: "Bearer caller-supplied-token",
      },
    });

    const [, init] = fetchMock.mock.calls[0];

    expect(new Headers(init?.headers).get("Authorization")).toBe(
      "Bearer example-access-token",
    );
  });
});
