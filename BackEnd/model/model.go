package model

//"go.mongodb.org/mongo-driver/bson/primitive"

type Donor struct {
	//ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Donor_name    string  `json:"donor_name,omitempty" bson:"donor_name"`
	Food_items    string  `json:"food_items,omitempty" bson:"food_items"`
	Donor_address string  `json:"donor_addr,omitempty" bson:"donor_addr"`
	Donor_City    string  `json:"donor_city,omitempty" bson:"donor_city"`
	Mobile_number string  `json:"dmobile_num,omitempty" bson:"dmobile_num"`
	Date_time     string  `json:"date,omitempty" bson:"date"`
	Donated       bool    `json:"donated,omitempty"`
	DonorLat      float64 `json:"d_lat,omitempty"`
	DonorLon      float64 `json:"d_lon,omitempty"`
}

type Receiver struct {
	//ID            primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Receiver_name    string  `json:"receiver_name,omitempty" bson:"receiver_name"`
	Reciever_address string  `json:"receiver_addr,omitempty" bson:"receiver_addr"`
	Receiver_City    string  `json:"receiver_city,omitempty" bson:"receiver_city"`
	Mobile_number    string  `json:"rmobile_num,omitempty" bson:"rmobile_num"`
	Date_time        string  `json:"date,omitempty" bson:"date"`
	Received         bool    `json:"received,omitempty"`
	ReceiverLat      float64 `json:"r_lat,omitempty"`
	ReceiverLon      float64 `json:"r_lon,omitempty"`
}
type Volunteer struct {
	//ID             primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Volunteer_name    string  `json:"volunteer_name,omitempty" bson:"volunteer_name"`
	Volunteer_Address string  `json:"vol_addr,omitempty" bson:"vol_addr"`
	Volunteer_City    string  `json:"vol_city,omitempty" bson:"vol_city"`
	Mobile_num        string  `json:"vmobile_num,omitempty" bson:"vmobile_num"`
	Availability      bool    `json:"availability,omitempty"`
	VolunteerLat      float64 `json:"v_lat,omitempty"`
	VolunteerLon      float64 `json:"v_lon,omitempty"`
}
type User struct {
	Username      string `json:"username,omitempty" bson:"username"`
	Email         string `json:"email,omitempty" bson:"email"`
	Mobile_Number string `json:"umobile_num,omitempty" bson:"umobile_num"`
	Password      string `json:"password,omitempty" bson:"password"`
}
type ChatMessage struct {
	Username string `json:"username"`
	Text     string `json:"text"`
}
