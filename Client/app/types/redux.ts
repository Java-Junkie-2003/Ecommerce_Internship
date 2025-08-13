export interface RootState {
    error: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
}