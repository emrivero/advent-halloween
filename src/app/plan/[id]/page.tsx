type Props = { params: { id: string } };

export default function PlanDetailPage({ params }: Props) {
  return <div className="py-10">[Plan {params.id}] Calendario, desbloqueo y progreso.</div>;
}
