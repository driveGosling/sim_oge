import "./MainPage.css";
import { Link } from "react-router-dom";
import VariantConstructor from "./VariantConstructor";

const Main = ({ variantsList }) => {
  return (
    <main className="main">
      <section className="section">
        <h2>Тренировочные варианты</h2>
        <ul>
          {variantsList.map((v) => (
            <li key={v.id}>
              <Link to={`/test/${v.id}`}>{v.name}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="section">
        <h2>Конструктор варианта по темам</h2>
        <p className="descr">
          Что­бы це­ле­на­прав­лен­но тре­ни­ро­вать­ся по опре­де­лён­ным
          те­мам, вы мо­же­те со­ста­вить ва­ри­ант из необ­хо­ди­мо­го
          ко­ли­че­ства за­да­ний по кон­крет­ным раз­де­лам за­дач­но­го
          ка­та­ло­га. Для быст­ро­го со­став­ле­ния ти­по­во­го ва­ри­ан­та
          ис­поль­зуй­те кноп­ки спра­ва.
        </p>
        <VariantConstructor />
      </section>
    </main>
  );
};

export default Main;
