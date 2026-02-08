import AboutUsCard from "../AboutUsCard/AboutUsCard.jsx";
import img_dev_1_holder from "../../assets/react.svg";
import img_dev_2_holder from "../../assets/Moirai_logo.png";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="about-us-card-holder">
        <div className="about-us-card-item">
          <AboutUsCard
            p_dev_image_path={img_dev_1_holder}
            p_dev_name="Evren"
            p_dev_desc="Kısa bir açıklama."
            p_dev_list_item_1="React Developer"
            p_dev_list_item_2="UI Designer"
            p_dev_list_item_3="Frontend"
          />
        </div>

        <div className="about-us-card-item">
          <AboutUsCard
            p_dev_image_path={img_dev_2_holder}
            p_dev_name="Berat"
            p_dev_desc="Bu açıklama metni ne kadar uzun olursa olsun, yanındaki kartla boyu otomatik olarak eşitlenecek ve tasarım bozulmayacaktır."
            p_dev_list_item_1="Backend Developer"
            p_dev_list_item_2="Node.js"
            p_dev_list_item_3="Database"
          />
        </div>
      </div>

      <p className="footer-bottom-info-item">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;