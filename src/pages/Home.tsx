import MessageListItem from "../components/MessageListItem";
import { useEffect, useState } from "react";
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Home.css";
import { ApiUrls } from "../data/apiUrls";
import { Geolocation } from "@ionic-native/geolocation";

const Home: React.FC = () => {
  const [showLogin, setShowLogin] = useState<any>(false);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [lat, setLat] = useState<string>();
  const [long, setLong] = useState<string>();
  const [name, setName] = useState<string>();
  const [locationDesc, setLocationDesc] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [issues, setIssues] = useState<any>(null);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  useEffect(() => {
    if (issues === null) {
      const username = sessionStorage.getItem("username");
      if (username) {
        fetchIssue();
        Geolocation.getCurrentPosition()
          .then((resp) => {
            setLat(resp.coords.latitude.toString());
            setLong(resp.coords.longitude.toString());
            console.log(resp);
            // resp.coords.latitude
            // resp.coords.longitude
          })
          .catch((error) => {
            console.log("Error getting location", error);
          });
      } else {
        setShowLogin(true);
      }
    }
  }, [issues]);

  const fetchIssue = () => {
    fetch(ApiUrls.issueApi, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setIssues(res.data);
        } else {
          alert("Something went wrong !!");
        }
      });
  };

  return (
    <IonPage id="home-page">
      <IonModal
        isOpen={!!showLogin}
        onDidDismiss={() => setShowLogin(false)}
        cssClass="my-custom-class"
      >
        {showLogin === true && (
          <IonContent>
            <IonList>
              <p>Please Login !!!</p>
              <IonItemDivider></IonItemDivider>
              <IonItem>
                <IonLabel position="floating">Enter Username</IonLabel>
                <IonInput
                  value={username}
                  onIonChange={(e) =>
                    setUsername((e.target as HTMLInputElement).value)
                  }
                ></IonInput>
              </IonItem>
              <IonItemDivider></IonItemDivider>
              <IonItem>
                <IonLabel position="floating">Enter Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) =>
                    setPassword((e.target as HTMLInputElement).value)
                  }
                ></IonInput>
              </IonItem>
            </IonList>
            <IonButton
              style={{ marginTop: "20px" }}
              onClick={() => {
                fetch(ApiUrls.loginApi, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                  },
                  body: JSON.stringify({
                    username,
                    password,
                  }),
                })
                  .then((res) => res.json())
                  .then((res) => {
                    if (res.data) {
                      sessionStorage.setItem("username", res.data.username);
                      setShowLogin(false);
                      fetchIssue();
                    } else {
                      alert("Wrong Credentials !!");
                    }
                  });
              }}
            >
              Login
            </IonButton>
          </IonContent>
        )}
        {showLogin === "addIssue" && (
          <IonContent>
            <IonList>
              <p>Enter Issue !!!</p>
              <IonItemDivider></IonItemDivider>
              <IonItem>
                <IonLabel position="floating">Issue Name</IonLabel>
                <IonInput
                  value={name}
                  onIonChange={(e) =>
                    setName((e.target as HTMLInputElement).value)
                  }
                ></IonInput>
              </IonItem>
              <IonItemDivider></IonItemDivider>
              <IonItem>
                <IonLabel position="floating">Location Description</IonLabel>
                <IonInput
                  value={locationDesc}
                  onIonChange={(e) =>
                    setLocationDesc((e.target as HTMLInputElement).value)
                  }
                ></IonInput>
              </IonItem>
              <IonItemDivider></IonItemDivider>
              <IonItem>
                <IonLabel position="floating">Issue Description</IonLabel>
                <IonTextarea
                  value={description}
                  onIonChange={(e) =>
                    setDescription((e.target as HTMLInputElement).value)
                  }
                ></IonTextarea>
              </IonItem>
            </IonList>
            <IonButton
              style={{ marginTop: "20px" }}
              onClick={() => {
                fetch(ApiUrls.issueApi, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                  },
                  body: JSON.stringify({
                    name,
                    locationDesc,
                    description,
                    username: sessionStorage.getItem("username"),
                    lat,
                    long,
                  }),
                })
                  .then((res) => res.json())
                  .then((res) => {
                    if (res.data) {
                      setShowLogin(false);
                      fetchIssue();
                    } else {
                      alert("Something went wrong !!");
                    }
                  });
              }}
            >
              Submit
            </IonButton>
          </IonContent>
        )}
      </IonModal>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            All Issues
            <span
              onClick={() => {
                sessionStorage.removeItem("username");
                setShowLogin(true);
              }}
            >
              ⏏️
            </span>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">All Issues</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {issues &&
            issues.map((m: any) => <MessageListItem key={m._id} message={m} />)}
        </IonList>
        <IonFab slot="fixed" style={{ width: "300px" }} vertical="bottom">
          <IonFabButton onClick={() => setShowLogin("addIssue")}>
            Add
          </IonFabButton>
        </IonFab>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton>Mine</IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
