import { IonItem, IonLabel, IonNote } from "@ionic/react";
import "./MessageListItem.css";

const getDate = (ts: string) => {
  return ts.split('T')[0];
}

const MessageListItem: React.FC<any> = ({ message }) => {
  return (
    <IonItem routerLink={`/message/${message._id}`} detail={false}>
      <div slot="start" className="dot dot-unread"></div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {message.name}
          <span className="date">
            <IonNote>{getDate(message.createdAt)}</IonNote>
          </span>
        </h2>
        <h3>{message.description}</h3>
        <p>By: {message.username} </p>
      </IonLabel>
    </IonItem>
  );
};

export default MessageListItem;
