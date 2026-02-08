import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AboutUsCard.css";

function AboutUsCard(props) {
  return (
    /* h-100 sınıfı kartın dış kapsayıcısının tüm boyunu kaplamasını sağlar */
    <Card className="card-item h-100 shadow-sm">
      <div className="card-img-container">
        <img 
          alt={props.p_dev_name} 
          src={props.p_dev_image_path} 
          className="custom-card-img"
        />
      </div>

      <CardBody className="d-flex flex-column">
        <CardTitle tag="h5" className="fw-bold"> {props.p_dev_name} </CardTitle>
        {/* flex-grow-1 metin kısa olsa bile butonları aşağı iter */}
        <CardText className="flex-grow-1 text-muted"> {props.p_dev_desc} </CardText>
      </CardBody>

      <ListGroup flush>
        <ListGroupItem> {props.p_dev_list_item_1} </ListGroupItem>
        <ListGroupItem> {props.p_dev_list_item_2} </ListGroupItem>
        <ListGroupItem> {props.p_dev_list_item_3} </ListGroupItem>
      </ListGroup>

      <CardBody className="mt-auto">
        <CardLink href="#" className="btn btn-outline-dark btn-sm">Github</CardLink>
        <CardLink href="#" className="btn btn-outline-primary btn-sm">LinkedIn</CardLink>
      </CardBody>
    </Card>
  );
}

export default AboutUsCard;