import LandingPage from "@/components/landing/LandingPage";
import EffLogo from "../../../../public/icons/new_efficiency.png";

export default function Page() {
  return (
    <main>
      <LandingPage
        title={`Efficiency & Heat Loss App`}
        img={EffLogo}
        bg={`bg-[url('/efficiency-app/landing.png')]`}
        description={`Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi
              accusantium quisquam, dolores officiis quo explicabo et,
              recusandae, quidem deserunt saepe minima adipisci rerum corrupti
              quam id molestias similique maxime ea.`}
        href="/efficiency-app"
      />
    </main>
  );
}
