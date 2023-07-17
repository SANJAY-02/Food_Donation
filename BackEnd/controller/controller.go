package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/sanjay/food-donate/model"
	"github.com/sanjay/food-donate/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

const connectionString = ""
const dbName = "food-donate"
const col1Name = "donor"
const col2Name = "receiver"
const col3Name = "volunteer"
const col4Name = "app-user"

var donor, receiver, volunteer, app_user *mongo.Collection

var SECRET_KEY = []byte("gosecretkey")

func init() {
	clientOption := options.Client().ApplyURI(connectionString)
	client, err := mongo.Connect(context.TODO(), clientOption)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("MongoDB Connection success")
	donor = client.Database(dbName).Collection(col1Name)
	receiver = client.Database(dbName).Collection(col2Name)
	volunteer = client.Database(dbName).Collection(col3Name)
	app_user = client.Database(dbName).Collection(col4Name)
	fmt.Println("Collection instance is ready")
}
func create(person interface{}, col *mongo.Collection) bool {
	inserted, err := col.InsertOne(context.Background(), person)
	if err != nil {
		log.Fatal(err)
		return false
	}
	fmt.Println("Inserted 1 donor in Db with ID :", inserted.InsertedID)
	return true
}
func check(name string, ID string, str string, t bool, col *mongo.Collection) bool {
	filter := bson.M{name: ID}
	update := bson.M{"$set": bson.M{str: t}}
	result, err := col.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
		return false
	}
	fmt.Println("Modified status count :", result.ModifiedCount)
	return true
}
func status(col *mongo.Collection, str string, t bool) []primitive.M {
	filter := bson.M{str: t}
	cur, err := col.Find(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}
	var entries []primitive.M
	for cur.Next(context.Background()) {
		var entry bson.M
		err := cur.Decode(&entry)
		if err != nil {
			log.Fatal(err)
		}
		entries = append(entries, entry)
	}
	defer cur.Close(context.Background())
	return entries
}
func getAll(col *mongo.Collection) []primitive.M {
	cur, err := col.Find(context.Background(), bson.D{{}})
	if err != nil {
		log.Fatal(err)
	}
	var entries []primitive.M
	for cur.Next(context.Background()) {
		var entry bson.M
		err := cur.Decode(&entry)
		if err != nil {
			log.Fatal(err)
		}
		entries = append(entries, entry)
	}
	defer cur.Close(context.Background())
	return entries
}
func deleteOne(ID string, col *mongo.Collection, user string) bool {
	filter := bson.M{user: ID}
	deleteCount, err := col.DeleteOne(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
		return false
	}
	fmt.Println("Data deleted with delete count: ", deleteCount)
	return true
}
func deleteAll(col *mongo.Collection) int64 {
	deleteResult, err := col.DeleteMany(context.Background(), bson.D{}, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Number of entries deleted :", deleteResult.DeletedCount)
	return deleteResult.DeletedCount
}
func update(user string, col *mongo.Collection, x map[string]string) (bool, int64) {
	filter := bson.M{user: x[user]}
	update := bson.M{}
	if col == donor {
		update = bson.M{"$set": bson.M{"food_items": x["food_items"], "donor_addr": x["donor_addr"], "donor_city": x["donor_city"], "dmobile_num": x["dmobile_num"], "date": x["date"]}}
	} else if col == receiver {
		update = bson.M{"$set": bson.M{"receiver_addr": x["receiver_addr"], "receiver_city": x["receiver_city"], "rmobile_num": x["rmobile_num"], "date": x["date"]}}
	} else {
		update = bson.M{"$set": bson.M{"vol_addr": x["vol_addr"], "vol_city": x["vol_city"], "vmobile_num": x["vmobile_num"]}}
	}
	result, err := col.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
		return false, 0
	}
	fmt.Println("Modified status count :", result.ModifiedCount)
	return true, result.ModifiedCount
}
func getUser(str string) bson.M {
    filter := bson.M{"username": str}
    var user bson.M
    err := app_user.FindOne(context.Background(), filter).Decode(&user)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            fmt.Errorf("User not found")
        }
        return nil
    }
    return user
}

// donor
func AddDonor(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "POST")
	var entry model.Donor
	_ = json.NewDecoder(r.Body).Decode(&entry)
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	if create(entry, donor) {
		utils.ErrorResponse(ctx, w, "Donor Added Successfully", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}
func GetAllDonors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	allEntries := getAll(donor)
	json.NewEncoder(w).Encode(allEntries)
}
func FoodDonated(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	if check("donor_name", x["donor_name"], "donated", true, donor) {
		utils.ErrorResponse(ctx, w, "Status updated Successfully", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}
func FoodNotDonated(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	if check("donor_name", x["donor_name"], "donated", false, donor) {
		utils.ErrorResponse(ctx, w, "Status updated Successfully", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}
func DeleteDonor(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	if deleteOne(x["donor_name"], donor, "donor_name") {
		utils.ErrorResponse(ctx, w, "Donor deleted Successfully", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}
func DeleteAllDonors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "DELETE")

	count := deleteAll(donor)
	json.NewEncoder(w).Encode(count)
}
func FoodAvailStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	allEntries := status(donor, "donated", false)
	json.NewEncoder(w).Encode(allEntries)
}
func UpdateDonor(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	if ok, count := update("donor_name", donor, x); ok && count == 1 {
		utils.ErrorResponse(ctx, w, "Donor updated Successfully", 200)
	} else if ok, count := update("donor_name", donor, x); ok && count == 0 {
		utils.ErrorResponse(ctx, w, "No changes by user", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}

// receiver
func AddReceiver(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "POST")
	var entry model.Receiver
	_ = json.NewDecoder(r.Body).Decode(&entry)
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	if create(entry, receiver) {
		utils.ErrorResponse(ctx, w, "Receiver Added Successfully", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}
func GetAllReceivers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	allEntries := getAll(receiver)
	json.NewEncoder(w).Encode(allEntries)
}
func FoodReceived(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	if check("receiver_name", x["receiver_name"], "received", true, receiver) {
		utils.ErrorResponse(ctx, w, "Status updated Successfully", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}
func FoodNotReceived(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	if check("receiver_name", x["receiver_name"], "received", false, receiver) {
		utils.ErrorResponse(ctx, w, "Status updated Successfully", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}
func DeleteReceiver(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	if deleteOne(x["receiver_name"], receiver, "receiver_name") {
		utils.ErrorResponse(ctx, w, "Receiver deleted Successfully", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}
func DeleteAllReceivers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "DELETE")

	count := deleteAll(receiver)
	json.NewEncoder(w).Encode(count)
}
func UpdateReceiver(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	if ok, count := update("receiver_name", receiver, x); ok && count == 1 {
		utils.ErrorResponse(ctx, w, "Receiver updated Successfully", 200)
	} else if ok, count := update("receiver_name", receiver, x); ok && count == 0 {
		utils.ErrorResponse(ctx, w, "No changes by user", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}

// volunteer
func AddVolunteer(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "POST")
	var entry model.Volunteer
	_ = json.NewDecoder(r.Body).Decode(&entry)
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	if create(entry, volunteer) {
		utils.ErrorResponse(ctx, w, "Volunteer Added Successfully", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}
func GetAllVolunteers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	allEntries := getAll(volunteer)
	json.NewEncoder(w).Encode(allEntries)
}
func VolunteerAvailable(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	if check("volunteer_name", x["volunteer_name"], "availability", true, volunteer) {
		utils.ErrorResponse(ctx, w, "Status updated Successfully", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}
func VolunteerNotAvailable(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	if check("volunteer_name", x["volunteer_name"], "availability", false, volunteer) {
		utils.ErrorResponse(ctx, w, "Status updated Successfully", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}
func DeleteVolunteer(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	if deleteOne(x["volunteer_name"], volunteer, "volunteer_name") {
		utils.ErrorResponse(ctx, w, "Receiver deleted Successfully", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}
func DeleteAllVolunteers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Allow-Control-Allow-Methods", "DELETE")

	count := deleteAll(volunteer)
	json.NewEncoder(w).Encode(count)
}
func VolunteerAvailStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	allEntries := status(volunteer, "availability", true)
	json.NewEncoder(w).Encode(allEntries)
}
func UpdateVolunteer(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	if ok, count := update("volunteer_name", volunteer, x); ok && count == 1 {
		utils.ErrorResponse(ctx, w, "Volunteer updated Successfully", 200)
	} else if ok, count := update("volunteer_name", volunteer, x); ok && count == 0 {
		utils.ErrorResponse(ctx, w, "No changes by user", 200)
	} else {
		utils.ErrorResponse(ctx, w, "Error!", 500)
	}
}

// general user
func getHash(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}
	return string(hash)
}
func GenerateJWT() (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	tokenString, err := token.SignedString(SECRET_KEY)
	if err != nil {
		log.Println("Error in JWT token generation")
		return "", err
	}
	return tokenString, nil
}
func UserSignup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user model.User
	var dbUser model.User
	_ = json.NewDecoder(r.Body).Decode(&user)
	fmt.Print(user)
	user.Password = getHash([]byte(user.Password))
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err1 := app_user.FindOne(ctx, bson.M{"username": user.Username}).Decode(&dbUser.Username)
	err2 := app_user.FindOne(ctx, bson.M{"email": user.Email}).Decode(&dbUser.Email)
	if err2 != mongo.ErrNoDocuments {
		log.Println(err2)
		utils.ErrorResponse(ctx, w, "Another user exists with the given e-mail", 500)
		return
	}
	if err1 != mongo.ErrNoDocuments {
		log.Println(err1)
		utils.ErrorResponse(ctx, w, "User already exists", 500)
		return
	}
	_, err := app_user.InsertOne(ctx, user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		// w.Write([]byte(`{"message":"` + err.Error() + `"}`))
		utils.ErrorResponse(ctx, w, err.Error(), 500)
		return
	} else {
		log.Println("Successful signup")
		utils.ErrorResponse(ctx, w, "Signedup Successfully", 200)
	}
}
func UserLogin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user model.User
	var dbUser model.User
	json.NewDecoder(r.Body).Decode(&user)
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err := app_user.FindOne(ctx, bson.M{"username": user.Username}).Decode(&dbUser)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		// w.Write([]byte(`{"message":"` + err.Error() + `"}`))
		utils.ErrorResponse(ctx, w, "User doesn't exist", 500)
		return
	}
	userPass := []byte(user.Password)
	dbPass := []byte(dbUser.Password)

	passErr := bcrypt.CompareHashAndPassword(dbPass, userPass)

	if passErr != nil {
		log.Println(passErr)
		utils.ErrorResponse(ctx, w, "Wrong Password", 500)
		// w.Write([]byte(`{"response":"Wrong Password!"}`))
		return
	} else {
		log.Println("Successful login")
	}
	jwtToken, err := GenerateJWT()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		// w.Write([]byte(`{"message":"` + err.Error() + `"}`))
		utils.ErrorResponse(ctx, w, err.Error(), 500)
		return
	}
	fmt.Println(jwtToken)
	utils.ErrorResponse(ctx, w, "Login Successful", 200)
}
func GetUserDetails(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var x map[string]string
	json.NewDecoder(r.Body).Decode(&x)
	details := getUser(x["username"])
	json.NewEncoder(w).Encode(details)
}
