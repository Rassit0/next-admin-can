export const PER_PAGE = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
  { label: "15", value: "15" },
  //   { label: "20", value: "20" },
];

export const PERMISSIONS = [
  {
    name: "Dashboard",
    permissions: [
      {
        name: "Graficos",
        permission: "dashboard",
      },
    ],
  },
  {
    name: "Roles",
    permissions: [
      {
        name: "Registrar",
        permission: "register_role",
      },
      {
        name: "Listado",
        permission: "list_role",
      },
      {
        name: "Editar",
        permission: "edit_role",
      },
      {
        name: "Eliminar",
        permission: "delete_role",
      },
    ],
  },
  {
    name: "Usuarios",
    permissions: [
      {
        name: "Registrar",
        permission: "register_user",
      },
      {
        name: "Listado",
        permission: "list_user",
      },
      {
        name: "Editar",
        permission: "edit_user",
      },
      {
        name: "Eliminar",
        permission: "delete_user",
      },
    ],
  },
  {
    name: "Configuraciones",
    permissions: [
      {
        name: "Disponible",
        permission: "settings",
      },
    ],
  },
  {
    name: "Productos",
    permissions: [
      {
        name: "Registrar",
        permission: "register_product",
      },
      {
        name: "Listado",
        permission: "list_product",
      },
      {
        name: "Editar",
        permission: "edit_product",
      },
      {
        name: "Eliminar",
        permission: "delete_product",
      },
      {
        name: "Ver Existencias",
        permission: "show_inventory_product",
      },
      {
        name: "Ver billetera de precios",
        permission: "show_wallet_price_product",
      },
    ],
  },
  {
    name: "Clientes",
    permissions: [
      {
        name: "Registrar",
        permission: "register_client",
      },
      {
        name: "Listado",
        permission: "list_client",
      },
      {
        name: "Editar",
        permission: "edit_client",
      },
      {
        name: "Eliminar",
        permission: "delete_client",
      },
    ],
  },
  {
    name: "Venta",
    permissions: [
      {
        name: "Registrar",
        permission: "register_sale",
      },
      {
        name: "Listado",
        permission: "list_sale",
      },
      {
        name: "Editar",
        permission: "edit_sale",
      },
      {
        name: "Eliminar",
        permission: "delete_sale",
      },
    ],
  },
  {
    name: "Devolución",
    permissions: [
      {
        name: "Disponible",
        permission: "return",
      },
    ],
  },
  {
    name: "Compras",
    permissions: [
      {
        name: "Registrar",
        permission: "register_purchase",
      },
      {
        name: "Listado",
        permission: "list_purchase",
      },

      {
        name: "Editar",
        permission: "edit_purchase",
      },
      {
        name: "Eliminar",
        permission: "delete_purchase",
      },
    ],
  },
  {
    name: "Transporte",
    permissions: [
      {
        name: "Registrar",
        permission: "register_transport",
      },
      {
        name: "Listado",
        permission: "list_transport",
      },
      {
        name: "Editar",
        permission: "edit_transport",
      },
      {
        name: "Eliminar",
        permission: "delete_transport",
      },
    ],
  },
  {
    name: "Conversiones",
    permissions: [
      {
        name: "Disponible",
        permission: "conversions",
      },
    ],
  },
  {
    name: "Kardex",
    permissions: [
      {
        name: "Disponible",
        permission: "kardex",
      },
    ],
  },
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }).format(amount);
};
