import AboutUsCard from "../AboutUsCard/AboutUsCard.jsx";

import img_dev_1_holder from '../../assets/react.svg';
import img_dev_2_holder from "../../assets/Moirai_logo.png";

function Footer() {
  return (
    <footer className="footer">

      <AboutUsCard
        p_dev_image_path={img_dev_1_holder}
        p_dev_name="Evren"
        p_dev_desc="This is a description"
        p_dev_list_item_1="Item 1"
        p_dev_list_item_2="Item 2"
        p_dev_list_item_3="Item 3"
      ></AboutUsCard>

      <AboutUsCard
        p_dev_image_path={img_dev_2_holder}
        p_dev_name="Berat"
        p_dev_desc="This is a description 2"
        p_dev_list_item_1="Item 4"
        p_dev_list_item_2="Item 5"
        p_dev_list_item_3="Item 6"
      ></AboutUsCard>

      <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      
    </footer>
  );
}

export default Footer;
