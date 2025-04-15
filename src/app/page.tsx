import { MeasuringTapeIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <MeasuringTapeIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Sayz</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>{"S'inscrire"}</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <Link
              href="/register"
              className="rounded-2xl bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            >
              Nouveau service
            </Link>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Fini les cadeaux de la{" "}
              <span className="text-primary">mauvaise taille</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Sayz vous permet de partager facilement vos tailles de vêtements, 
              chaussures et accessoires avec vos proches pour des cadeaux parfaitement ajustés.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="px-8">Commencer</Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="px-8">
                  Comment ça marche
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="container py-12 md:py-16 lg:py-24">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="rounded-full bg-primary/20 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>
              </div>
              <h3 className="text-xl font-bold">Créez votre profil</h3>
              <p className="text-muted-foreground">
                Inscrivez-vous et renseignez vos tailles pour différentes marques et catégories.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="rounded-full bg-primary/20 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              </div>
              <h3 className="text-xl font-bold">Partagez votre lien</h3>
              <p className="text-muted-foreground">
                Envoyez votre lien personnalisé à vos proches avant un événement spécial.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="rounded-full bg-primary/20 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="m6 9 6 6 6-6"></path></svg>
              </div>
              <h3 className="text-xl font-bold">Recevez des cadeaux parfaits</h3>
              <p className="text-muted-foreground">
                Vos proches peuvent consulter vos tailles et vous offrir des cadeaux parfaitement adaptés.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <MeasuringTapeIcon className="h-6 w-6 text-primary" />
            <span className="font-semibold">Sayz</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground">
            © {new Date().getFullYear()} Sayz. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Confidentialité
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}