
import { Card, CardBody, CardTitle, CardText, CardLink, ListGroup, ListGroupItem} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AboutUsCard.css';


function AboutUsCard(props){

    return(
        <Card
  style={{
    width: '18rem'
  }}
>
  <img
    alt="Card"
    src={props.p_dev_image_path}
  />

  <CardBody>
    <CardTitle tag="h5"> {props.p_dev_name} </CardTitle>
    <CardText> {props.p_dev_desc} </CardText>
  </CardBody>

  <ListGroup flush>
    <ListGroupItem> {props.p_dev_list_item_1} </ListGroupItem>
    <ListGroupItem> {props.p_dev_list_item_2} </ListGroupItem>
    <ListGroupItem> {props.p_dev_list_item_3} </ListGroupItem>
  </ListGroup>

  <CardBody>
    <CardLink href="#">Github</CardLink>
    <CardLink href="#">LinkedIn</CardLink>
  </CardBody>

</Card>
        
    );
       
}



export default AboutUsCard;