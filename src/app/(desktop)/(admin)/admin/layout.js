import AdminLayoutWrapper from "@/components/desktop/admin/LayoutWrapper";

export const metadata = {
  title: "Admin Panel | PlanWab - Event Planning Made Easy",
  description:
    "Manage your events efficiently. Access dashboards, user management, and settings all in one place with PlanWab's Admin Panel.",
     alternates: {
    canonical: "https://www.planwab.com",
  },
};

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </>
  );
}
