import { MealForm } from "@/components/meals/meal-form"

export default function NewMealPage() {
  return (
    <div className="space-y-5">
      <h1 className="font-serif text-2xl font-semibold text-foreground">Registrar Refeição</h1>
      <MealForm />
    </div>
  )
}
