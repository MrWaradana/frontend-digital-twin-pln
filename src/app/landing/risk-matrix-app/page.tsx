import LandingPage from "@/components/landing/LandingPage";
import RiskLogo from "../../../../public/icons/new_risk_matrix.png";

export default function Page() {
  return (
    <main>
      <LandingPage
        title={`Risk Matrix App`}
        img={RiskLogo}
        bg={`bg-[url('/risk-matrix-app/landing.png')]`}
        description={`Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi
              accusantium quisquam, dolores officiis quo explicabo et,
              recusandae, quidem deserunt saepe minima adipisci rerum corrupti
              quam id molestias similique maxime ea.`}
        href={`/risk-matrix-app`}
      />
    </main>
  );
}
