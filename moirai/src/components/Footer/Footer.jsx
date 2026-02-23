import AboutUsCard from "../AboutUsCard/AboutUsCard.jsx";
import img_dev_1_holder from "../../assets/logo-evren.png";
import img_dev_2_holder from "../../assets/logo-fatih.png";
import "./Footer.css";

function Footer() {
  return (
    <div id="about">
      <footer className="footer">
      <div className="about-us-card-holder">
        <div className="about-us-card-item">
          <AboutUsCard
            p_dev_image_path={img_dev_1_holder}
            p_dev_name="Evren Efe BALCI"
            p_dev_desc="A determined developer and code enjoyer who loves to learn and improve himself."
            p_dev_list_item_1="Project Manager"
            p_dev_list_item_2="React Developer"
            p_dev_list_item_3="Backend / Node.js"
            p_dev_github_link="https://github.com/Evrenefeb"
            p_dev_linkedin_link="https://www.linkedin.com/in/evren-efe-balci/"
          />
        </div>

        <div className="about-us-card-item">
          <AboutUsCard
            p_dev_image_path={img_dev_2_holder}
            p_dev_name="Fatih Berat BAKIRTAŞ"
            p_dev_desc="Bu açıklama metni ne kadar uzun olursa olsun, yanındaki kartla boyu otomatik olarak eşitlenecek ve tasarım bozulmayacaktır."
            p_dev_list_item_1="Fullstack Developer"
            p_dev_list_item_2="React / Javascript"
            p_dev_list_item_3="Frontend"
            p_dev_github_link="https://github.com/fatihb4rat-jpg" 
            p_dev_linkedin_link="https://www.linkedin.com/in/fatih-berat-bak%C4%B1rta%C5%9F-913a30298/" 
          />
        </div>
      </div>

      <p className="footer-bottom-info-item">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
    </div>
    
  );
}

export default Footer;