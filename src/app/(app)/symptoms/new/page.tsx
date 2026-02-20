import { SymptomForm } from "@/components/symptoms/symptom-form"

export default function NewSymptomPage() {
  return (
    <div className="space-y-5">
      <h1 className="font-serif text-2xl font-semibold text-foreground">Registrar Sintoma</h1>
      <SymptomForm />
    </div>
  )
}
