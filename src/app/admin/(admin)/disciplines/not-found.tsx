"use client";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h2 className="text-xl font-bold">Hubo un problema</h2>
      <p className="text-gray-600">No se encontraron disciplinas</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
