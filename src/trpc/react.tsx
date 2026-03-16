// src/trpc/react.tsx
import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/src/server/routers/_app"; // Caminho para seu AppRouter

export const api = createTRPCReact<AppRouter>();