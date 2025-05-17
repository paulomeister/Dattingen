import TrendCompliancesChart from "@/components/statistics/TrendCompliancesChart";
import { TrendCompliances } from '@/types/statistics';

// const auditoriasData = [
//   {
//     id: "A-102",
//     totalAuditorias: 132,
//     auditoriasActivas: 24,
//     auditoriasConMasProcesos: ["#A-102", "#B-305"],
//     duracionPromedioHoras: 4.5,
//     porcentajeConformidades: 82,
//     porcentajeInconformidades: 18,
//     tendenciaConformidades: [
//       { fecha: "Ene", cantidadConformidades: 75 },
//       { fecha: "Feb", cantidadConformidades: 80 },
//       { fecha: "Mar", cantidadConformidades: 85 },
//       { fecha: "Abr", cantidadConformidades: 82 },
//       { fecha: "May", cantidadConformidades: 84 },
//     ],
//     phvaConMasInconformidades: "Actuar (A)",
//     ruleset: "Ruleset1",
//   },
//   {
//     id: "B-305",
//     totalAuditorias: 98,
//     auditoriasActivas: 18,
//     auditoriasConMasProcesos: ["#B-305", "#C-210"],
//     duracionPromedioHoras: 3.8,
//     porcentajeConformidades: 76,
//     porcentajeInconformidades: 24,
//     tendenciaConformidades: [
//       { fecha: "Ene", cantidadConformidades: 70 },
//       { fecha: "Feb", cantidadConformidades: 74 },
//       { fecha: "Mar", cantidadConformidades: 77 },
//       { fecha: "Abr", cantidadConformidades: 75 },
//       { fecha: "May", cantidadConformidades: 78 },
//     ],
//     phvaConMasInconformidades: "Planear (P)",
//     ruleset: "Ruleset2",
//   },
//   {
//     id: "C-210",
//     totalAuditorias: 150,
//     auditoriasActivas: 30,
//     auditoriasConMasProcesos: ["#C-210", "#D-400"],
//     duracionPromedioHoras: 5.2,
//     porcentajeConformidades: 88,
//     porcentajeInconformidades: 12,
//     tendenciaConformidades: [
//       { fecha: "Ene", cantidadConformidades: 85 },
//       { fecha: "Feb", cantidadConformidades: 87 },
//       { fecha: "Mar", cantidadConformidades: 89 },
//       { fecha: "Abr", cantidadConformidades: 90 },
//       { fecha: "May", cantidadConformidades: 91 },
//     ],
//     phvaConMasInconformidades: "Hacer (H)",
//     ruleset: "Ruleset3",
//   },
// ];

const auditoriaDesdeApi = [
  {
    totalAudits: 5,
    totalAuditsActive: 2,
    auditsWithMostProcesses: {
      _id: "abc123",
      name: "Auditoría ISO 27001",
    },
    meanAuditTime: 14,
    audits: [
      {
        conformityProcess: 75.5,
        nonConformityProcess: 24.5,
        phvaInformities: { plan: 3, doPhase: 2, check: 4, act: 1 },
        createdAt: "2025-05-01T00:00:00.000Z",
      },
      {
        conformityProcess: 82,
        nonConformityProcess: 18,
        phvaInformities: { plan: 1, doPhase: 1, check: 0, act: 2 },
        createdAt: "2025-05-10T00:00:00.000Z",
      },
    ],
  },
  {
    totalAudits: 6,
    totalAuditsActive: 3,
    auditsWithMostProcesses: {
      _id: "def456",
      name: "Auditoría HSEQ General",
    },
    meanAuditTime: 10.5,
    audits: [
      {
        conformityProcess: 65,
        nonConformityProcess: 35,
        phvaInformities: { plan: 4, doPhase: 3, check: 1, act: 2 },
        createdAt: "2025-04-15T00:00:00.000Z",
      },
      {
        conformityProcess: 72,
        nonConformityProcess: 28,
        phvaInformities: { plan: 2, doPhase: 2, check: 3, act: 1 },
        createdAt: "2025-04-30T00:00:00.000Z",
      },
      {
        conformityProcess: 70,
        nonConformityProcess: 30,
        phvaInformities: { plan: 1, doPhase: 1, check: 1, act: 3 },
        createdAt: "2025-05-10T00:00:00.000Z",
      },
    ],
  },
  {
    totalAudits: 4,
    totalAuditsActive: 1,
    auditsWithMostProcesses: {
      _id: "ghi789",
      name: "Auditoría NTC ISO 9001",
    },
    meanAuditTime: 6.8,
    audits: [
      {
        conformityProcess: 88,
        nonConformityProcess: 12,
        phvaInformities: { plan: 0, doPhase: 1, check: 0, act: 1 },
        createdAt: "2025-03-01T00:00:00.000Z",
      },
      {
        conformityProcess: 90,
        nonConformityProcess: 10,
        phvaInformities: { plan: 0, doPhase: 0, check: 1, act: 1 },
        createdAt: "2025-03-15T00:00:00.000Z",
      },
    ],
  },
  {
    totalAudits: 7,
    totalAuditsActive: 4,
    auditsWithMostProcesses: {
      _id: "jkl012",
      name: "Auditoría ISO 14001 Ambiental",
    },
    meanAuditTime: 11.2,
    audits: [
      {
        conformityProcess: 78,
        nonConformityProcess: 22,
        phvaInformities: { plan: 2, doPhase: 1, check: 3, act: 1 },
        createdAt: "2025-04-01T00:00:00.000Z",
      },
      {
        conformityProcess: 80,
        nonConformityProcess: 20,
        phvaInformities: { plan: 1, doPhase: 2, check: 2, act: 2 },
        createdAt: "2025-04-20T00:00:00.000Z",
      },
      {
        conformityProcess: 85,
        nonConformityProcess: 15,
        phvaInformities: { plan: 1, doPhase: 1, check: 0, act: 1 },
        createdAt: "2025-05-03T00:00:00.000Z",
      },
    ],
  },
  {
    totalAudits: 3,
    totalAuditsActive: 1,
    auditsWithMostProcesses: {
      _id: "mno345",
      name: "Auditoría Interna SG-SST",
    },
    meanAuditTime: 9,
    audits: [
      {
        conformityProcess: 68,
        nonConformityProcess: 32,
        phvaInformities: { plan: 2, doPhase: 4, check: 2, act: 2 },
        createdAt: "2025-03-25T00:00:00.000Z",
      },
      {
        conformityProcess: 73,
        nonConformityProcess: 27,
        phvaInformities: { plan: 1, doPhase: 2, check: 2, act: 1 },
        createdAt: "2025-04-05T00:00:00.000Z",
      },
    ],
  },
];


function transformarAuditoria(apiData: typeof auditoriaDesdeApi) {
  return apiData.map((auditoria) => {
    const tendenciaConformidades: TrendCompliances[] = auditoria.audits.map((audit) => ({
      fecha: new Date(audit.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }),
      cantidadConformidades: audit.conformityProcess,
    }));

    const phvaTotales = {
      plan: 0,
      doPhase: 0,
      check: 0,
      act: 0,
    };

    auditoria.audits.forEach((audit) => {
      phvaTotales.plan += audit.phvaInformities.plan;
      phvaTotales.doPhase += audit.phvaInformities.doPhase;
      phvaTotales.check += audit.phvaInformities.check;
      phvaTotales.act += audit.phvaInformities.act;
    });

    const phvaKeyConMasInconformidades = Object.entries(phvaTotales).reduce(
      (max, curr) => (curr[1] > max[1] ? curr : max),
      ['', 0]
    )[0];

    const phvaConMasInconformidades = {
      plan: 'Planear (P)',
      doPhase: 'Hacer (H)',
      check: 'Verificar (V)',
      act: 'Actuar (A)',
    }[phvaKeyConMasInconformidades];

    const promedioConformidades = Math.round(
      auditoria.audits.reduce((acc, a) => acc + a.conformityProcess, 0) / auditoria.audits.length
    );

    const promedioInconformidades = Math.round(
      auditoria.audits.reduce((acc, a) => acc + a.nonConformityProcess, 0) / auditoria.audits.length
    );

    return {
      id: auditoria.auditsWithMostProcesses._id,
      totalAuditorias: auditoria.totalAudits,
      auditoriasActivas: auditoria.totalAuditsActive,
      auditoriasConMasProcesos: [auditoria.auditsWithMostProcesses.name],
      duracionPromedioHoras: auditoria.meanAuditTime,
      porcentajeConformidades: promedioConformidades,
      porcentajeInconformidades: promedioInconformidades,
      tendenciaConformidades,
      phvaConMasInconformidades,
    };
  });
}


const auditoriasData = transformarAuditoria(auditoriaDesdeApi);



const tendenciaConformidades: TrendCompliances[] = auditoriaDesdeApi.flatMap((grupo) =>
  grupo.audits.map((audit) => ({
    fecha: new Date(audit.createdAt).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
    cantidadConformidades: audit.conformityProcess,
  }))
);


console.log(auditoriasData);


export default function StatisticsPage() {
  return (
    <div className="max-w-7xl mx-auto p-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
        Estadísticas de la Organización
      </h1>
      {auditoriasData.map(auditoria => (
        <div key={auditoria.id} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 bg-gray-50 rounded-xl shadow">
          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <p className="text-gray-500 text-sm">Auditorías Totales</p>
            <h2 className="text-2xl font-bold text-gray-800">{auditoria.totalAuditorias}</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <p className="text-gray-500 text-sm">Auditorías Activas</p>
            <h2 className="text-2xl font-bold text-gray-800">{auditoria.auditoriasActivas}</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <p className="text-gray-500 text-sm">Auditorías con más procesos</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {auditoria.auditoriasConMasProcesos.join(", ")}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <p className="text-gray-500 text-sm">Duración Promedio</p>
            <h2 className="text-2xl font-bold text-gray-800">{auditoria.duracionPromedioHoras} hrs</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <p className="text-gray-500 text-sm">% Conformidades</p>
            <h2 className="text-2xl font-bold text-green-600">{auditoria.porcentajeConformidades}%</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <p className="text-gray-500 text-sm">% Inconformidades</p>
            <h2 className="text-2xl font-bold text-red-600">{auditoria.porcentajeInconformidades}%</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Tendencia de Conformidades</h3>
            <TrendCompliancesChart data={tendenciaConformidades} />
          </div>

          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <h3 className="text-lg font-semibold mb-2">PHVA con más Inconformidades</h3>
            <p className="text-xl font-bold text-red-500">{auditoria.phvaConMasInconformidades}</p>
          </div>
        </div>
      ))}
      {/* <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-4 rounded-2xl shadow col-span-1">
          <p className="text-gray-500 text-sm">Auditorías Totales</p>
          <h2 className="text-2xl font-bold text-gray-800">132</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow col-span-1">
          <p className="text-gray-500 text-sm">Auditorías Activas</p>
          <h2 className="text-2xl font-bold text-gray-800">24</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow col-span-1">
          <p className="text-gray-500 text-sm">Auditorías con más procesos</p>
          <h2 className="text-2xl font-bold text-gray-800">#A-102, #B-305</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow col-span-1">
          <p className="text-gray-500 text-sm">Duración Promedio</p>
          <h2 className="text-2xl font-bold text-gray-800">4.5 hrs</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow col-span-1">
          <p className="text-gray-500 text-sm">% Conformidades</p>
          <h2 className="text-2xl font-bold text-green-600">82%</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow col-span-1">
          <p className="text-gray-500 text-sm">% Inconformidades</p>
          <h2 className="text-2xl font-bold text-red-600">18%</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">Tendencia de Conformidades</h3>
          <TrendCompliancesChart />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow col-span-1">
          <h3 className="text-lg font-semibold mb-2">PHVA con más Inconformidades</h3>
          <p className="text-xl font-bold text-red-500">Actuar (A)</p>
        </div>
      </div> */}
    </div>
  );
}
