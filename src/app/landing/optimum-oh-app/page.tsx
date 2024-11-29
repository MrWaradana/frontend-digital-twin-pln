import LandingPage from "@/components/landing/LandingPage";
import OptLogo from "../../../../public/icons/new_optimum_oh.png";

export default function Page() {
  return (
    <main>
      <LandingPage
        title={`Optimum OH App`}
        img={OptLogo}
        bg={`bg-[url('/optimum-oh-app/landing.png')]`}
        description={`Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi
              accusantium quisquam, dolores officiis quo explicabo et,
              recusandae, quidem deserunt saepe minima adipisci rerum corrupti
              quam id molestias similique maxime ea.`}
        href={`/optimum-oh-app`}
      />
    </main>
  );
}
