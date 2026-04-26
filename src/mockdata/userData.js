export const demoUser = {
  name: "Dani Quinto (Demo)",
  email: "testuser@quinto.com",
  password: "TestUser2026!",
  cellphone: "+57 3001234567",
  addresses: [
    "Calle 100 # 15 - 20, Bogotá, Bogotá D.C., Colombia",
    "Carrera 7 # 72 - 01, Bogotá, Bogotá D.C., Colombia"
  ],
  orders: [
    {
      id: "QT-A1B2C3",
      createdAt: new Date("2026-04-20"),
      items: [
        { name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops", quantity: 1, price: 109.95 }
      ],
      total: 109.95,
      shippingAddress: "Calle 100 # 15 - 20, Bogotá, Bogotá D.C., Colombia",
      paymentMethod: "Contraentrega"
    }
  ]
};
