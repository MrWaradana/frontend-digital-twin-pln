import LandingPage from "@/components/landing/LandingPage";
import LCCALogo from "../../../../public/icons/new_LCCA.png";

export default function Page() {
  return (
    <main>
      <LandingPage
        title={`LCCA App`}
        img={LCCALogo}
        bg={`bg-[url('/lcca-app/landing.png')]`}
        description={`Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi
              accusantium quisquam, dolores officiis quo explicabo et,
              recusandae, quidem deserunt saepe minima adipisci rerum corrupti
              quam id molestias similique maxime ea.`}
        href="/lcca-app"
      />
    </main>
  );
}
