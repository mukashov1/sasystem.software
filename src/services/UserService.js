import $api from "../http/api";

export default class UserService {
  static fetchUsers() {
    return $api.get("/users");
  }

  static fetchLessons() {
    return $api.get("/lessonsCurrent");
  }
}
