// lib/apiResponse.js
import { NextResponse } from "next/server";

export const ok = (data = {}, status = 200) =>
  NextResponse.json({ success: true, ...data }, { status });

export const created = (data = {}) =>
  NextResponse.json({ success: true, ...data }, { status: 201 });

export const badRequest = (message = "Bad request", errors = null) =>
  NextResponse.json(
    { success: false, message, ...(errors && { errors }) },
    { status: 400 }
  );

export const notFound = (message = "Not found") =>
  NextResponse.json({ success: false, message }, { status: 404 });

export const serverError = (message = "Internal server error", err = null) => {
  if (err) console.error("[API Error]", err);
  return NextResponse.json({ success: false, message }, { status: 500 });
};

export const methodNotAllowed = () =>
  NextResponse.json({ success: false, message: "Method not allowed" }, { status: 405 });