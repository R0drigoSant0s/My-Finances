import Finances from "@/components/Finances";
import AuthGuard from "@/components/AuthGuard";
import AppLayout from "@/components/Layout/AppLayout";

export default function Home() {
  return (
    <AuthGuard>
      <AppLayout>
        <Finances />
      </AppLayout>
    </AuthGuard>
  );
}