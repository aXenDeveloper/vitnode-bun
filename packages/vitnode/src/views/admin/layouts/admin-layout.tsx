export const AdminLayout = ({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  return (
    <div>
      <div>admin layout</div>
      {children}
    </div>
  );
};
