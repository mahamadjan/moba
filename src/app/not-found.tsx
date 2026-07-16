import Link from "next/link";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-8xl font-bold text-primary mb-4">404</h2>
      <h3 className="text-2xl text-white mb-6">Страница в разработке</h3>
      <p className="text-foreground/60 mb-8 max-w-md">
        Мы активно работаем над созданием этой страницы. Пожалуйста, вернитесь на главную или загляните позже.
      </p>
      <Link href="/">
        <Button size="lg">Вернуться на главную</Button>
      </Link>
    </div>
  );
}
