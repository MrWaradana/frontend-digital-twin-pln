"use client";

import React, { useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { RiskMatrixContentLayout } from "@/containers/RiskMatrixContentLayout";
import { useGetLikelihoods } from "@/lib/APIs/risk-matrix/useGetLikelihood";
import { useGetSeverities } from "@/lib/APIs/risk-matrix/useGetSeverity";
import { useGetEquipments } from "@/lib/APIs/risk-matrix/useGetEquipment";
import { useGetPofs } from "@/lib/APIs/risk-matrix/useGetPof";
import { useGetRisks } from "@/lib/APIs/risk-matrix/useGetRisk";

export default function Page() {
  // const session = useSession();
  // Get Severities
  const {
    data: severityDatas,
    isLoading: loadingSeverity,
    mutate: mutateSeverity,
  } = useGetSeverities();

  // Get Likelihoods
  const {
    data: likelihoodDatas,
    isLoading: loadingLikelihood,
    mutate: mutateLikelihood,
  } = useGetLikelihoods();

  // Get Equipments & its sub
  const {
    data: equipmentDatas,
    isLoading: loadingEquipment,
    mutate: mutateEquipment,
  } = useGetEquipments();

  // Get Risks
  const {
    data: riskDatas,
    isLoading: loadingRisk,
    mutate: mutateRisk,
  } = useGetRisks();

  // Get Predict of Failure
  const {
    data: pofDatas,
    isLoading: loadingPof,
    mutate: mutatePof,
  } = useGetPofs();

  const severities = severityDatas ?? [];
  const likelihoods = likelihoodDatas ?? [];
  const equipments = equipmentDatas ?? [];
  const risks = riskDatas ?? [];
  const pofs = pofDatas ?? [];

  // Get All Years in PoF
  const pofYears = Array.from(
    new Set(pofDatas?.map((item) => item.year))
  ).sort();

  // const [severities, setSeverities] = useState(severityDatas);
  // const [likelihoods, setLikelihoods] = useState(likelihoodDatas);
  // const [equipments, setEquipments] = useState(equipmentDatas);

  // useEffect(() => {
  //   if (severityDatas) {
  //     setSeverities(severityDatas);
  //   }
  // }, [severityDatas, loadingSeverity]);

  // useEffect(() => {
  //   if (likelihoodDatas) {
  //     setLikelihoods(likelihoodDatas);
  //   }
  // }, [likelihoodDatas, loadingLikelihood]);

  if (
    loadingSeverity ||
    loadingLikelihood ||
    loadingEquipment ||
    loadingRisk ||
    loadingPof
  ) {
    return <div>...loading</div>;
  }

  return (
    <RiskMatrixContentLayout title="TEST DATA">
      <div className="w-full max-w-3xl mx-auto p-4">
        {/* <div id="likelihood-data">
          <ol>
            {severities?.map((severity) => {
              return <li key={severity.id}>{severity.name}</li>;
            })}
          </ol>
        </div> */}
        <div id="likelihood-data">{JSON.stringify(likelihoods)}</div>
        <hr />
        <br />
        <div id="severity-data">{JSON.stringify(severities)}</div>
        <hr />
        <br />
        <div id="equipment-data">{JSON.stringify(equipments)}</div>
        <hr />
        <br />
        <div id="risk-data">{JSON.stringify(risks)}</div>
        <hr />
        <br />
        <div id="pof-data">{JSON.stringify(pofs)}</div>
        <hr />
        <br />
        <h2>SORTED PoFs YEARS</h2>
        <div id="pof-year-data">{JSON.stringify(pofYears)}</div>
        <hr />
        <br />
      </div>
    </RiskMatrixContentLayout>
  );
}
