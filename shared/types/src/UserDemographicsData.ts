export interface UserDemographicsData {
  age: "19_24" | "25_34" | "35_44" | "45_54" | "55_64" | "over_65";
  exactIncome: number;
  gender: "male" | "female" | "neither" | "decline";
  hispanicLatinxSpanishOrigin: "hispanicLatinxSpanish" | "other";
  race: RaceType[];
  school: SchoolType;
  zipcode: number;
}

export enum SchoolType {
  LessThanHighSchool = "less_than_high_school",
  SomeHighSchool = "some_high_school",
  HighSchoolGraduateOrEquivalent = "high_school_graduate_or_equivalent",
  SomeCollegeButNoDegreeOrInProgress = "some_college_but_no_degree_or_in_progress",
  AssociatesDegree = "associates_degree",
  BachelorsDegree = "bachelors_degree",
  GraduateDegree = "graduate_degree",
}

export enum RaceType {
  AmericanIndianOrAlaskaNative = "american_indian_or_alaska_native",
  AsianIndian = "asian_indian",
  BlackOrAfricanAmerican = "black_or_african_american",
  Chamorro = "chamorro",
  Chinese = "chinese",
  Filipino = "filipino",
  Japanese = "japanese",
  Korean = "korean",
  NativeHawaiian = "native_hawaiian",
  Samoan = "samoan",
  Vietnamese = "vietnamese",
  White = "white",
  OtherAsian = "other_asian",
  OtherPacificIslander = "other_pacific_islander",
  SomeOtherRace = "some_other_race",
}
