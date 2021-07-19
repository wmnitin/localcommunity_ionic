import { useState } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { personCircle } from "ionicons/icons";
import { useParams } from "react-router";
import "./ViewMessage.css";
import { ApiUrls } from "../data/apiUrls";

const getDate = (ts: string) => {
  return ts.split("T")[0];
};

function ViewMessage() {
  const [message, setMessage] = useState<any>();
  const params = useParams<{ id: string }>();
  const [issue, setIssue] = useState<any>(null);

  useIonViewWillEnter(() => {
    fetch(ApiUrls.issueApi + "/" + params.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setIssue(res.data);
        } else {
          alert("Something went wrong !!");
        }
      });
  });

  const username = sessionStorage.getItem("username");

  const updateIssue = (status: any) => {
    fetch(ApiUrls.issueApi + "/" + params.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        status,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setIssue(res.data);
        } else {
          alert("Something went wrong !!");
        }
      });
  };

  return (
    <IonPage id="view-message-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              text="All Issues"
              defaultHref="/home"
            ></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {issue ? (
          <>
            <IonItem>
              <IonIcon icon={personCircle} color="primary"></IonIcon>
              <IonLabel className="ion-text-wrap">
                <h2>
                  Issue Name: {issue.name}
                  <span className="date">
                    <IonNote>{getDate(issue.createdAt)}</IonNote>
                  </span>
                </h2>
                <h3>
                  Created by: <IonNote>{issue.username}</IonNote>
                </h3>
              </IonLabel>
            </IonItem>

            <div className="ion-padding">
              <p>Location Description : {issue.locationDesc}</p>
              <p>Issue Description: {issue.description}</p>
              <p>Status: {issue.status}</p>
              <p>lat: {issue.lat}</p>
              <p>long: {issue.long}</p>
              {username === issue.username && issue.status === "addressed" && (
                <IonButton onClick={() => updateIssue("fixed")}>
                  Fix Confirmed
                </IonButton>
              )}
              {username !== issue.username && issue.status === "new" && (
                <IonButton onClick={() => updateIssue("addressed")}>
                  Flag as Fixed
                </IonButton>
              )}
            </div>
          </>
        ) : (
          <div>Issue not found</div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default ViewMessage;
