import { MapPin } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Painel esquerdo - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="text-center text-primary-foreground">
          <MapPin className="mx-auto mb-6" size={64} />
          <h1 className="text-4xl font-bold mb-3">GeoContacts</h1>
          <p className="text-lg opacity-90">
            Gerencie seus contatos com endereço e localizacao no mapa.
          </p>
        </div>
      </div>

      {/* Painel direito - formulario */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
