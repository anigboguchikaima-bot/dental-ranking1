import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Star,
  BarChart2,
  Sparkles,
  Palette,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import ProfileBar from "./ProfileBar";
import { getUser, ensureUserRanking, loadData, saveData } from "./cloud";
import { supabase } from "./supabaseClient"; // ← must be up here

/* -------------------- CONSTANTS / HELPERS (OUTSIDE COMPONENT) -------------------- */

/* -------------------- SCHOOL BANK -------------------- */

const MED_SCHOOLS = [
  {
    "key": "university-of-alabama-at-birmingham-marnix-e-heersink-school-of-medicine",
    "name": "University of Alabama at Birmingham Marnix E. Heersink School of Medicine",
    "city": "Birmingham",
    "state": "Alabama"
  },
  {
    "key": "frederick-p-whiddon-college-of-medicine-at-the-university-of-south-alabama",
    "name": "Frederick P. Whiddon College of Medicine at the University of South Alabama",
    "city": "Mobile",
    "state": "Alabama"
  },
  {
    "key": "university-of-arizona-college-of-medicine-phoenix",
    "name": "University of Arizona College of Medicine - Phoenix",
    "city": "Phoenix",
    "state": "Arizona"
  },
  {
    "key": "university-of-arizona-college-of-medicine-tucson",
    "name": "University of Arizona College of Medicine - Tucson",
    "city": "Tucson",
    "state": "Arizona"
  },
  {
    "key": "alice-l-walton-school-of-medicine",
    "name": "Alice L. Walton School of Medicine",
    "city": "Bentonville",
    "state": "Arkansas"
  },
  {
    "key": "university-of-arkansas-for-medical-sciences-college-of-medicine",
    "name": "University of Arkansas for Medical Sciences College of Medicine",
    "city": "Little Rock",
    "state": "Arkansas"
  },
  {
    "key": "california-northstate-university-college-of-medicine",
    "name": "California Northstate University College of Medicine",
    "city": "Elk Grove",
    "state": "California"
  },
  {
    "key": "california-university-of-science-and-medicine-school-of-medicine",
    "name": "California University of Science and Medicine - School of Medicine",
    "city": "Colton",
    "state": "California"
  },
  {
    "key": "charles-r-drew-university-of-medicine-and-science-college-of-medicine",
    "name": "Charles R. Drew University of Medicine and Science College of Medicine",
    "city": "Los Angeles",
    "state": "California"
  },
  {
    "key": "david-geffen-school-of-medicine-at-ucla",
    "name": "David Geffen School of Medicine at UCLA",
    "city": "Los Angeles",
    "state": "California"
  },
  {
    "key": "kaiser-permanente-bernard-j-tyson-school-of-medicine",
    "name": "Kaiser Permanente Bernard J. Tyson School of Medicine",
    "city": "Pasadena",
    "state": "California"
  },
  {
    "key": "keck-school-of-medicine-of-the-university-of-southern-california",
    "name": "Keck School of Medicine of the University of Southern California",
    "city": "Los Angeles",
    "state": "California"
  },
  {
    "key": "loma-linda-university-school-of-medicine",
    "name": "Loma Linda University School of Medicine",
    "city": "Loma Linda",
    "state": "California"
  },
  {
    "key": "stanford-university-school-of-medicine",
    "name": "Stanford University School of Medicine",
    "city": "Palo Alto",
    "state": "California"
  },
  {
    "key": "university-of-california-davis-school-of-medicine",
    "name": "University of California, Davis School of Medicine",
    "city": "Davis",
    "state": "California"
  },
  {
    "key": "university-of-california-irvine-school-of-medicine",
    "name": "University of California, Irvine School of Medicine",
    "city": "Irvine",
    "state": "California"
  },
  {
    "key": "university-of-california-riverside-school-of-medicine",
    "name": "University of California, Riverside School of Medicine",
    "city": "Riverside",
    "state": "California"
  },
  {
    "key": "university-of-california-san-diego-school-of-medicine",
    "name": "University of California, San Diego School of Medicine",
    "city": "San Diego",
    "state": "California"
  },
  {
    "key": "university-of-california-san-francisco-school-of-medicine",
    "name": "University of California, San Francisco School of Medicine",
    "city": "San Francisco",
    "state": "California"
  },
  {
    "key": "university-of-colorado-school-of-medicine",
    "name": "University of Colorado School of Medicine",
    "city": "Denver",
    "state": "Colorado"
  },
  {
    "key": "frank-h-netter-md-school-of-medicine-at-quinnipiac-university",
    "name": "Frank H. Netter MD School of Medicine at Quinnipiac University",
    "city": "North Haven",
    "state": "Connecticut"
  },
  {
    "key": "university-of-connecticut-school-of-medicine",
    "name": "University of Connecticut School of Medicine",
    "city": "Farmington",
    "state": "Connecticut"
  },
  {
    "key": "yale-school-of-medicine",
    "name": "Yale School of Medicine",
    "city": "New Haven",
    "state": "Connecticut"
  },
  {
    "key": "george-washington-university-school-of-medicine-and-health-sciences",
    "name": "George Washington University School of Medicine and Health Sciences",
    "city": "Washington",
    "state": "District of Columbia"
  },
  {
    "key": "georgetown-university-school-of-medicine",
    "name": "Georgetown University School of Medicine",
    "city": "Washington",
    "state": "District of Columbia"
  },
  {
    "key": "howard-university-college-of-medicine",
    "name": "Howard University College of Medicine",
    "city": "Washington",
    "state": "District of Columbia"
  },
  {
    "key": "charles-e-schmidt-college-of-medicine-at-florida-atlantic-university",
    "name": "Charles E. Schmidt College of Medicine at Florida Atlantic University",
    "city": "Boca Raton",
    "state": "Florida"
  },
  {
    "key": "florida-international-university-herbert-wertheim-college-of-medicine",
    "name": "Florida International University Herbert Wertheim College of Medicine",
    "city": "Miami",
    "state": "Florida"
  },
  {
    "key": "florida-state-university-college-of-medicine",
    "name": "Florida State University College of Medicine",
    "city": "Tallahassee",
    "state": "Florida"
  },
  {
    "key": "nova-southeastern-university-dr-kiran-c-patel-college-of-allopathic-medicine",
    "name": "Nova Southeastern University Dr. Kiran C. Patel College of Allopathic Medicine",
    "city": "Fort Lauderdale",
    "state": "Florida"
  },
  {
    "key": "university-of-central-florida-college-of-medicine",
    "name": "University of Central Florida College of Medicine",
    "city": "Orlando",
    "state": "Florida"
  },
  {
    "key": "university-of-florida-college-of-medicine",
    "name": "University of Florida College of Medicine",
    "city": "Gainesville",
    "state": "Florida"
  },
  {
    "key": "university-of-miami-leonard-m-miller-school-of-medicine",
    "name": "University of Miami Leonard M. Miller School of Medicine",
    "city": "Miami",
    "state": "Florida"
  },
  {
    "key": "usf-health-morsani-college-of-medicine",
    "name": "USF Health Morsani College of Medicine",
    "city": "Tampa",
    "state": "Florida"
  },
  {
    "key": "emory-university-school-of-medicine",
    "name": "Emory University School of Medicine",
    "city": "Atlanta",
    "state": "Georgia"
  },
  {
    "key": "medical-college-of-georgia-at-augusta-university",
    "name": "Medical College of Georgia at Augusta University",
    "city": "Augusta",
    "state": "Georgia"
  },
  {
    "key": "mercer-university-school-of-medicine",
    "name": "Mercer University School of Medicine",
    "city": "Macon",
    "state": "Georgia"
  },
  {
    "key": "morehouse-school-of-medicine",
    "name": "Morehouse School of Medicine",
    "city": "Atlanta",
    "state": "Georgia"
  },
  {
    "key": "john-a-burns-school-of-medicine-university-of-hawaii-at-manoa",
    "name": "John A. Burns School of Medicine University of Hawaii at Manoa",
    "city": "Honolulu",
    "state": "Hawaii"
  },
  {
    "key": "carle-illinois-college-of-medicine",
    "name": "Carle Illinois College of Medicine",
    "city": "Urbana-Champaign",
    "state": "Illinois"
  },
  {
    "key": "chicago-medical-school-at-rosalind-franklin-university-of-medicine-and-science",
    "name": "Chicago Medical School at Rosalind Franklin University of Medicine and Science",
    "city": "North Chicago",
    "state": "Illinois"
  },
  {
    "key": "loyola-university-chicago-stritch-school-of-medicine",
    "name": "Loyola University Chicago Stritch School of Medicine",
    "city": "Maywood",
    "state": "Illinois"
  },
  {
    "key": "northwestern-university-feinberg-school-of-medicine",
    "name": "Northwestern University Feinberg School of Medicine",
    "city": "Chicago",
    "state": "Illinois"
  },
  {
    "key": "rush-medical-college-of-rush-university-medical-center",
    "name": "Rush Medical College of Rush University Medical Center",
    "city": "Chicago",
    "state": "Illinois"
  },
  {
    "key": "southern-illinois-university-school-of-medicine",
    "name": "Southern Illinois University School of Medicine",
    "city": "Springfield",
    "state": "Illinois"
  },
  {
    "key": "university-of-chicago-division-of-the-biological-sciences-the-pritzker-school-of-medicine",
    "name": "University of Chicago Division of the Biological Sciences, The Pritzker School of Medicine",
    "city": "Chicago",
    "state": "Illinois"
  },
  {
    "key": "university-of-illinois-college-of-medicine",
    "name": "University of Illinois College of Medicine",
    "city": "Chicago",
    "state": "Illinois"
  },
  {
    "key": "indiana-university-school-of-medicine",
    "name": "Indiana University School of Medicine",
    "city": "Indianapolis",
    "state": "Indiana"
  },
  {
    "key": "university-of-iowa-roy-j-and-lucille-a-carver-college-of-medicine",
    "name": "University of Iowa Roy J. and Lucille A. Carver College of Medicine",
    "city": "Iowa City",
    "state": "Iowa"
  },
  {
    "key": "university-of-kansas-school-of-medicine",
    "name": "University of Kansas School of Medicine",
    "city": "Kansas City",
    "state": "Kansas"
  },
  {
    "key": "university-of-kentucky-college-of-medicine",
    "name": "University of Kentucky College of Medicine",
    "city": "Lexington",
    "state": "Kentucky"
  },
  {
    "key": "university-of-louisville-school-of-medicine",
    "name": "University of Louisville School of Medicine",
    "city": "Louisville",
    "state": "Kentucky"
  },
  {
    "key": "louisiana-state-university-school-of-medicine-in-shreveport",
    "name": "Louisiana State University School of Medicine in Shreveport",
    "city": "Shreveport",
    "state": "Louisiana"
  },
  {
    "key": "lsu-health-sciences-center-school-of-medicine-in-new-orleans",
    "name": "LSU Health Sciences Center School of Medicine in New Orleans",
    "city": "New Orleans",
    "state": "Louisiana"
  },
  {
    "key": "tulane-university-school-of-medicine",
    "name": "Tulane University School of Medicine",
    "city": "New Orleans",
    "state": "Louisiana"
  },
  {
    "key": "johns-hopkins-university-school-of-medicine",
    "name": "Johns Hopkins University School of Medicine",
    "city": "Baltimore",
    "state": "Maryland"
  },
  {
    "key": "uniformed-services-university",
    "name": "Uniformed Services University ...",
    "city": "Bethesda",
    "state": "Maryland"
  },
  {
    "key": "university-of-maryland-school-of-medicine",
    "name": "University of Maryland School of Medicine",
    "city": "Baltimore",
    "state": "Maryland"
  },
  {
    "key": "boston-university-school-of-medicine",
    "name": "Boston University ... School of Medicine",
    "city": "Boston",
    "state": "Massachusetts"
  },
  {
    "key": "harvard-medical-school",
    "name": "Harvard Medical School",
    "city": "Boston",
    "state": "Massachusetts"
  },
  {
    "key": "tufts-university-school-of-medicine",
    "name": "Tufts University School of Medicine",
    "city": "Boston",
    "state": "Massachusetts"
  },
  {
    "key": "university-of-massachusetts-t-h-chan-school-of-medicine",
    "name": "University of Massachusetts T.H. Chan School of Medicine",
    "city": "Worcester",
    "state": "Massachusetts"
  },
  {
    "key": "central-michigan-university-college-of-medicine",
    "name": "Central Michigan University College of Medicine",
    "city": "Mount Pleasant",
    "state": "Michigan"
  },
  {
    "key": "michigan-state-university-college-of-human-medicine",
    "name": "Michigan State University College of Human Medicine",
    "city": "East Lansing",
    "state": "Michigan"
  },
  {
    "key": "oakland-university-william-beaumont-school-of-medicine",
    "name": "Oakland University William Beaumont School of Medicine",
    "city": "Rochester",
    "state": "Michigan"
  },
  {
    "key": "university-of-michigan-medical-school",
    "name": "University of Michigan Medical School",
    "city": "Ann Arbor",
    "state": "Michigan"
  },
  {
    "key": "wayne-state-university-school-of-medicine",
    "name": "Wayne State University School of Medicine",
    "city": "Detroit",
    "state": "Michigan"
  },
  {
    "key": "western-michigan-university-homer-stryker-m-d-school-of-medicine",
    "name": "Western Michigan University Homer Stryker M.D. School of Medicine",
    "city": "Kalamazoo",
    "state": "Michigan"
  },
  {
    "key": "mayo-clinic-alix-school-of-medicine",
    "name": "Mayo Clinic Alix School of Medicine",
    "city": "Rochester",
    "state": "Minnesota"
  },
  {
    "key": "university-of-minnesota-medical-school",
    "name": "University of Minnesota Medical School",
    "city": "Minneapolis",
    "state": "Minnesota"
  },
  {
    "key": "university-of-mississippi-school-of-medicine",
    "name": "University of Mississippi School of Medicine",
    "city": "Jackson",
    "state": "Mississippi"
  },
  {
    "key": "saint-louis-university-school-of-medicine",
    "name": "Saint Louis University School of Medicine",
    "city": "St. Louis",
    "state": "Missouri"
  },
  {
    "key": "university-of-missouri-columbia-school-of-medicine",
    "name": "University of Missouri-Columbia School of Medicine",
    "city": "Columbia",
    "state": "Missouri"
  },
  {
    "key": "university-of-missouri-kansas-city-school-of-medicine",
    "name": "University of Missouri-Kansas City School of Medicine",
    "city": "Kansas City",
    "state": "Missouri"
  },
  {
    "key": "washington-university-in-st-louis-school-of-medicine",
    "name": "Washington University in St. Louis School of Medicine",
    "city": "St. Louis",
    "state": "Missouri"
  },
  {
    "key": "creighton-university-school-of-medicine",
    "name": "Creighton University School of Medicine",
    "city": "Omaha",
    "state": "Nebraska"
  },
  {
    "key": "university-of-nebraska-college-of-medicine",
    "name": "University of Nebraska College of Medicine",
    "city": "Omaha",
    "state": "Nebraska"
  },
  {
    "key": "kirk-kerkorian-school-of-medicine-at-unlv",
    "name": "Kirk Kerkorian School of Medicine at UNLV",
    "city": "Las Vegas",
    "state": "Nevada"
  },
  {
    "key": "roseman-university-college-of-medicine",
    "name": "Roseman University College of Medicine",
    "city": "Las Vegas",
    "state": "Nevada"
  },
  {
    "key": "university-of-nevada-reno-school-of-medicine",
    "name": "University of Nevada, Reno School of Medicine",
    "city": "Reno",
    "state": "Nevada"
  },
  {
    "key": "geisel-school-of-medicine-at-dartmouth",
    "name": "Geisel School of Medicine at Dartmouth",
    "city": "Hanover",
    "state": "New Hampshire"
  },
  {
    "key": "cooper-medical-school-of-rowan-university",
    "name": "Cooper Medical School of Rowan University",
    "city": "Camden",
    "state": "New Jersey"
  },
  {
    "key": "hackensack-meridian-school-of-medicine",
    "name": "Hackensack Meridian School of Medicine",
    "city": "Nutley",
    "state": "New Jersey"
  },
  {
    "key": "rutgers-new-jersey-medical-school",
    "name": "Rutgers New Jersey Medical School",
    "city": "Newark",
    "state": "New Jersey"
  },
  {
    "key": "rutgers-robert-wood-johnson-medical-school",
    "name": "Rutgers, Robert Wood Johnson Medical School",
    "city": "Piscataway",
    "state": "New Jersey"
  },
  {
    "key": "university-of-new-mexico-school-of-medicine",
    "name": "University of New Mexico School of Medicine",
    "city": "Albuquerque",
    "state": "New Mexico"
  },
  {
    "key": "albany-medical-college",
    "name": "Albany Medical College",
    "city": "Albany",
    "state": "New York"
  },
  {
    "key": "albert-einstein-college-of-medicine",
    "name": "Albert Einstein College of Medicine",
    "city": "New York",
    "state": "New York"
  },
  {
    "key": "columbia-university-vagelos-college-of-physicians-and-surgeons",
    "name": "Columbia University Vagelos College of Physicians and Surgeons",
    "city": "New York",
    "state": "New York"
  },
  {
    "key": "cuny-school-of-medicine",
    "name": "CUNY School of Medicine",
    "city": "New York",
    "state": "New York"
  },
  {
    "key": "donald-and-barbara-zucker-school",
    "name": "Donald and Barbara Zucker School ...",
    "city": "Hempstead",
    "state": "New York"
  },
  {
    "key": "icahn-school-of-medicine-at-mount-sinai",
    "name": "Icahn School of Medicine at Mount Sinai",
    "city": "New York",
    "state": "New York"
  },
  {
    "key": "jacobs-school-of-medicine-at-buffalo",
    "name": "Jacobs School of Medicine at Buffalo",
    "city": "Buffalo",
    "state": "New York"
  },
  {
    "key": "new-york-medical-college",
    "name": "New York Medical College",
    "city": "Valhalla",
    "state": "New York"
  },
  {
    "key": "nyu-grossman-school-of-medicine",
    "name": "NYU Grossman School of Medicine",
    "city": "New York",
    "state": "New York"
  },
  {
    "key": "nyu-grossman-long-island-school-of-medicine",
    "name": "NYU Grossman Long Island School of Medicine",
    "city": "Mineola",
    "state": "New York"
  },
  {
    "key": "renaissance-school-of-medicine-at-stony-brook-university",
    "name": "Renaissance School of Medicine at Stony Brook University",
    "city": "Stony Brook",
    "state": "New York"
  },
  {
    "key": "suny-upstate-medical-university",
    "name": "SUNY Upstate Medical University",
    "city": "Syracuse",
    "state": "New York"
  },
  {
    "key": "suny-downstate-health-sciences-university-college-of-medicine",
    "name": "SUNY Downstate Health Sciences University College of Medicine",
    "city": "Brooklyn",
    "state": "New York"
  },
  {
    "key": "university-of-rochester-school-of-medicine-and-dentistry",
    "name": "University of Rochester School of Medicine and Dentistry",
    "city": "Rochester",
    "state": "New York"
  },
  {
    "key": "weill-cornell-medicine",
    "name": "Weill Cornell Medicine",
    "city": "New York",
    "state": "New York"
  },
  {
    "key": "brody-school-of-medicine-at-east-carolina-university",
    "name": "Brody School of Medicine at East Carolina University",
    "city": "Greenville",
    "state": "North Carolina"
  },
  {
    "key": "duke-university-school-of-medicine",
    "name": "Duke University School of Medicine",
    "city": "Durham",
    "state": "North Carolina"
  },
  {
    "key": "university-of-north-carolina-school-of-medicine",
    "name": "University of North Carolina School of Medicine",
    "city": "Chapel Hill",
    "state": "North Carolina"
  },
  {
    "key": "wake-forest-university-school-of-medicine",
    "name": "Wake Forest University School of Medicine",
    "city": "Winston-Salem",
    "state": "North Carolina"
  },
  {
    "key": "university-of-north-dakota-school-of-medicine-and-health-sciences",
    "name": "University of North Dakota School of Medicine and Health Sciences",
    "city": "Grand Forks",
    "state": "North Dakota"
  },
  {
    "key": "boonshoft-school-of-medicine-wright-state-university",
    "name": "Boonshoft School of Medicine Wright State University",
    "city": "Dayton",
    "state": "Ohio"
  },
  {
    "key": "case-western-reserve-university-school-of-medicine",
    "name": "Case Western Reserve University School of Medicine",
    "city": "Cleveland",
    "state": "Ohio"
  },
  {
    "key": "northeast-ohio-medical-university",
    "name": "Northeast Ohio Medical University",
    "city": "Rootstown",
    "state": "Ohio"
  },
  {
    "key": "alabama-college-of-osteopathic-medicine-acom",
    "name": "Alabama College of Osteopathic Medicine (ACOM)",
    "city": "Dothan",
    "state": "AL"
  },
  {
    "key": "arkansas-college-of-osteopathic-medicine-arcom",
    "name": "Arkansas College of Osteopathic Medicine (ARCOM)",
    "city": "Fort Smith",
    "state": "AR"
  },
  {
    "key": "at-still-university-kirksville-college-of-osteopathic-medicine-atsu-kcom",
    "name": "A.T. Still University Kirksville College of Osteopathic Medicine (ATSU-KCOM)",
    "city": "Kirksville",
    "state": "MO"
  },
  {
    "key": "at-still-university-school-of-osteopathic-medicine-in-arizona-atsu-soma",
    "name": "A.T. Still University, School of Osteopathic Medicine in Arizona (ATSU-SOMA)",
    "city": "Mesa",
    "state": "AZ"
  },
  {
    "key": "burrell-college-of-osteopathic-medicine-bcom",
    "name": "Burrell College of Osteopathic Medicine (BCOM)",
    "city": "Las Cruces",
    "state": "NM"
  },
  {
    "key": "burrell-college-of-osteopathic-medicine-florida-bcom-fl",
    "name": "Burrell College of Osteopathic Medicine, Florida (BCOM-FL)",
    "city": "Tampa",
    "state": "FL"
  },
  {
    "key": "baptist-health-sciences-university-college-of-osteopathic-medicine-bucom",
    "name": "Baptist Health Sciences University College of Osteopathic Medicine (BUCOM)",
    "city": "Memphis",
    "state": "TN"
  },
  {
    "key": "california-health-sciences-university-college-of-osteopathic-medicine-chsu-com",
    "name": "California Health Sciences University College of Osteopathic Medicine (CHSU-COM)",
    "city": "Clovis",
    "state": "CA"
  },
  {
    "key": "campbell-university-jerry-m-wallace-school-of-osteopathic-medicine-cusom",
    "name": "Campbell University Jerry M. Wallace School of Osteopathic Medicine (CUSOM)",
    "city": "Lillington",
    "state": "NC"
  },
  {
    "key": "des-moines-university-college-of-osteopathic-medicine-dmu-com",
    "name": "Des Moines University College of Osteopathic Medicine (DMU-COM)",
    "city": "Des Moines",
    "state": "IA"
  },
  {
    "key": "duquesne-university-college-of-osteopathic-medicine-duqcom",
    "name": "Duquesne University College of Osteopathic Medicine (DUQCOM)",
    "city": "Pittsburgh",
    "state": "PA"
  },
  {
    "key": "edward-via-college-of-osteopathic-medicine-vcom---auburn-campus",
    "name": "Edward Via College of Osteopathic Medicine (VCOM - Auburn Campus)",
    "city": "Auburn",
    "state": "AL"
  },
  {
    "key": "edward-via-college-of-osteopathic-medicine-carolinas-campus-vcom---carolinas-campus",
    "name": "Edward Via College of Osteopathic Medicine-Carolinas Campus (VCOM - Carolinas Campus)",
    "city": "Spartanburg",
    "state": "SC"
  },
  {
    "key": "edward-via-college-of-osteopathic-medicine-louisiana-vcom-louisiana",
    "name": "Edward Via College of Osteopathic Medicine-Louisiana (VCOM-Louisiana)",
    "city": "Monroe",
    "state": "LA"
  },
  {
    "key": "edward-via-college-of-osteopathic-medicine-vcom-virginia-campus",
    "name": "Edward Via College of Osteopathic Medicine (VCOM-Virginia Campus)",
    "city": "Blacksburg",
    "state": "VA"
  },
  {
    "key": "idaho-college-of-osteopathic-medicine-icom",
    "name": "Idaho College of Osteopathic Medicine (ICOM)",
    "city": "Meridian",
    "state": "ID"
  },
  {
    "key": "kansas-health-sciences-center-kansas-college-of-osteopathic-medicine-kansascom",
    "name": "Kansas Health Sciences Center Kansas College of Osteopathic Medicine (KansasCOM)",
    "city": "Wichita",
    "state": "KS"
  },
  {
    "key": "kansas-city-university--kansas-city-kcu-com-kc",
    "name": "Kansas City University \u2013 Kansas City (KCU-COM-KC)",
    "city": "Kansas City",
    "state": "MO"
  },
  {
    "key": "kansas-city-university--joplin-kcu-com-joplin",
    "name": "Kansas City University \u2013 Joplin (KCU-COM-Joplin)",
    "city": "Joplin",
    "state": "MO"
  },
  {
    "key": "lake-erie-college-of-osteopathic-medicine-erie-lecom",
    "name": "Lake Erie College of Osteopathic Medicine-Erie (LECOM)",
    "city": "Erie",
    "state": "PA"
  },
  {
    "key": "lake-erie-college-of-osteopathic-medicine-bradenton-lecom-bradenton",
    "name": "Lake Erie College of Osteopathic Medicine-Bradenton (LECOM-Bradenton)",
    "city": "Bradenton",
    "state": "FL"
  },
  {
    "key": "lake-erie-college-of-osteopathic-medicine---elmira-lecom-elmira",
    "name": "Lake Erie College of Osteopathic Medicine - Elmira (LECOM-Elmira)",
    "city": "Elmira",
    "state": "NY"
  },
  {
    "key": "lake-erie-college-of-osteopathic-medicine---seton-hill-lecom-seton-hill",
    "name": "Lake Erie College of Osteopathic Medicine - Seton Hill (LECOM-Seton Hill)",
    "city": "Greensburg",
    "state": "PA"
  },
  {
    "key": "liberty-university-college-of-osteopathic-medicine-lucom",
    "name": "Liberty University College of Osteopathic Medicine (LUCOM)",
    "city": "Lynchburg",
    "state": "VA"
  },
  {
    "key": "lincoln-memorial-university-debusk-college-of-osteopathic-medicine-lmu-dcom",
    "name": "Lincoln Memorial University-DeBusk College of Osteopathic Medicine (LMU-DCOM)",
    "city": "Harrogate",
    "state": "TN"
  },
  {
    "key": "lincoln-memorial-university-debusk-college-of-osteopathic-medicine--knoxville-lmu-dcom-knoxville",
    "name": "Lincoln Memorial University-DeBusk College of Osteopathic Medicine \u2013 Knoxville (LMU-DCOM Knoxville)",
    "city": "Knoxville",
    "state": "TN"
  },
  {
    "key": "lincoln-memorial-university-debusk-college-of-osteopathic-medicine--orange-park-lmu-dcom-orange-park",
    "name": "Lincoln Memorial University-DeBusk College of Osteopathic Medicine \u2013 Orange Park (LMU-DCOM Orange Park)",
    "city": "Orange Park",
    "state": "FL"
  },
  {
    "key": "marian-university-tom-and-julie-wood-college-of-osteopathic-medicine-mu-wcom",
    "name": "Marian University Tom and Julie Wood College of Osteopathic Medicine (MU-WCOM)",
    "city": "Indianapolis",
    "state": "IN"
  },
  {
    "key": "meritus-school-of-osteopathic-medicine-msom",
    "name": "Meritus School of Osteopathic Medicine (MSOM)",
    "city": "Hagerstown",
    "state": "MD"
  },
  {
    "key": "michigan-state-university-college-of-osteopathic-medicine-msucom",
    "name": "Michigan State University College of Osteopathic Medicine (MSUCOM)",
    "city": "East Lansing",
    "state": "MI"
  },
  {
    "key": "michigan-state-university-college-of-osteopathic-medicine-msucom-dmc",
    "name": "Michigan State University College of Osteopathic Medicine (MSUCOM-DMC)",
    "city": "Detroit",
    "state": "MI"
  },
  {
    "key": "michigan-state-university-college-of-osteopathic-medicine-msucom-muc",
    "name": "Michigan State University College of Osteopathic Medicine (MSUCOM-MUC)",
    "city": "Clinton Township",
    "state": "MI"
  },
  {
    "key": "midwestern-university-arizona-college-of-osteopathic-medicine-mwu-azcom",
    "name": "Midwestern University Arizona College of Osteopathic Medicine (MWU/AZCOM)",
    "city": "Glendale",
    "state": "AZ"
  },
  {
    "key": "midwestern-university-chicago-college-of-osteopathic-medicine-mwu-ccom",
    "name": "Midwestern University Chicago College of Osteopathic Medicine (MWU/CCOM)",
    "city": "Downers Grove",
    "state": "IL"
  },
  {
    "key": "new-york-institute-of-technology-college-of-osteopathic-medicine-nyitcom",
    "name": "New York Institute of Technology College of Osteopathic Medicine (NYITCOM)",
    "city": "Old Westbury",
    "state": "NY"
  },
  {
    "key": "new-york-institute-of-technology-college-of-osteopathic-medicine-at-arkansas-state-nyitcom-arkansas",
    "name": "New York Institute of Technology College of Osteopathic Medicine at Arkansas State (NYITCOM-Arkansas)",
    "city": "Jonesboro",
    "state": "AR"
  },
  {
    "key": "noorda-college-of-osteopathic-medicine",
    "name": "Noorda College of Osteopathic Medicine",
    "city": "Provo",
    "state": "UT"
  },
  {
    "key": "nova-southeastern-university-dr-kiran-c-patel-college-of-osteopathic-medicine-nsu-kpcom",
    "name": "Nova Southeastern University Dr. Kiran C. Patel College of Osteopathic Medicine (NSU-KPCOM)",
    "city": "Davie",
    "state": "FL"
  },
  {
    "key": "nova-southeastern-university-dr-kiran-c-patel-college-of-osteopathic-medicine-nsu-kpcom-clearwater",
    "name": "Nova Southeastern University Dr. Kiran C. Patel College of Osteopathic Medicine (NSU-KPCOM-Clearwater)",
    "city": "Clearwater",
    "state": "FL"
  },
  {
    "key": "ohio-university-heritage-college-of-osteopathic-medicine-ou-hcom",
    "name": "Ohio University Heritage College of Osteopathic Medicine (OU-HCOM)",
    "city": "Athens",
    "state": "OH"
  },
  {
    "key": "ohio-university-heritage-college-of-osteopathic-medicine-in-cleveland-ou-hcom-cleveland",
    "name": "Ohio University Heritage College of Osteopathic Medicine in Cleveland (OU-HCOM-Cleveland)",
    "city": "Cleveland",
    "state": "OH"
  },
  {
    "key": "ohio-university-heritage-college-of-osteopathic-medicine-in-dublin-ou-hcom-dublin",
    "name": "Ohio University Heritage College of Osteopathic Medicine in Dublin (OU-HCOM-Dublin)",
    "city": "Dublin",
    "state": "OH"
  },
  {
    "key": "oklahoma-state-university-center-for-health-sciences-college-of-osteopathic-medicine-osu-com",
    "name": "Oklahoma State University Center for Health Sciences College of Osteopathic Medicine (OSU-COM)",
    "city": "Tulsa",
    "state": "OK"
  },
  {
    "key": "oklahoma-state-university-center-for-health-sciences-college-of-osteopathic-medicine---tahlequah-osu-com-tahlequah",
    "name": "Oklahoma State University Center for Health Sciences College of Osteopathic Medicine - Tahlequah (OSU-COM Tahlequah)",
    "city": "Tahlequah",
    "state": "OK"
  },
  {
    "key": "orlando-college-of-osteopathic-medicine-ocom",
    "name": "Orlando College of Osteopathic Medicine (OCOM)",
    "city": "Orlando",
    "state": "FL"
  },
  {
    "key": "pacific-northwest-university-of-health-sciences-college-of-osteopathic-medicine-pnwu-com",
    "name": "Pacific Northwest University of Health Sciences College of Osteopathic Medicine (PNWU-COM)",
    "city": "Yakima",
    "state": "WA"
  },
  {
    "key": "philadelphia-college-of-osteopathic-medicine-pcom",
    "name": "Philadelphia College of Osteopathic Medicine (PCOM)",
    "city": "Philadelphia",
    "state": "PA"
  },
  {
    "key": "philadelphia-college-of-osteopathic-medicine-georgia-pcom-georgia",
    "name": "Philadelphia College of Osteopathic Medicine Georgia (PCOM Georgia)",
    "city": "Suwanee",
    "state": "GA"
  },
  {
    "key": "philadelphia-college-of-osteopathic-medicine-south-georgia-pcom-south-georgia",
    "name": "Philadelphia College of Osteopathic Medicine South Georgia (PCOM South Georgia)",
    "city": "Moultrie",
    "state": "GA"
  },
  {
    "key": "rocky-vista-university-college-of-osteopathic-medicine-rvucom",
    "name": "Rocky Vista University College of Osteopathic Medicine (RVUCOM)",
    "city": "Parker",
    "state": "CO"
  },
  {
    "key": "rocky-vista-university---montana-college-of-osteopathic-medicine-rvu-mcom",
    "name": "Rocky Vista University - Montana College of Osteopathic Medicine (RVU-MCOM)",
    "city": "Billings",
    "state": "MT"
  },
  {
    "key": "rocky-vista-university-college-of-osteopathic-medicine-rvucom-su-campus",
    "name": "Rocky Vista University College of Osteopathic Medicine (RVUCOM-SU Campus)",
    "city": "Ivins",
    "state": "UT"
  },
  {
    "key": "rowan-virtua-school-of-osteopathic-medicine-rowan-virtuasom",
    "name": "Rowan-Virtua School of Osteopathic Medicine (Rowan-VirtuaSOM)",
    "city": "Stratford",
    "state": "NJ"
  },
  {
    "key": "rowan-virtua-school-of-osteopathic-medicine-rowan-virtuasom-sewell",
    "name": "Rowan-Virtua School of Osteopathic Medicine (Rowan-VirtuaSOM-Sewell)",
    "city": "Sewell",
    "state": "NJ"
  },
  {
    "key": "sam-houston-state-university-college-of-osteopathic-medicine-shsu-com",
    "name": "Sam Houston State University College of Osteopathic Medicine (SHSU-COM)",
    "city": "Conroe",
    "state": "TX"
  },
  {
    "key": "touro-college-of-osteopathic-medicine---great-falls-tourocom-great-falls",
    "name": "Touro College of Osteopathic Medicine - Great Falls (TouroCOM-Great Falls)",
    "city": "Great Falls",
    "state": "MT"
  },
  {
    "key": "touro-college-of-osteopathic-medicine-tourocom-harlem",
    "name": "Touro College of Osteopathic Medicine (TouroCOM-Harlem)",
    "city": "New York",
    "state": "NY"
  },
  {
    "key": "touro-college-of-osteopathic-medicine-tourocom-middletown",
    "name": "Touro College of Osteopathic Medicine (TouroCOM-Middletown)",
    "city": "Middletown",
    "state": "NY"
  },
  {
    "key": "touro-university-college-of-osteopathic-medicine-california-tucom",
    "name": "Touro University College of Osteopathic Medicine-California (TUCOM)",
    "city": "Vallejo",
    "state": "CA"
  },
  {
    "key": "touro-university-nevada-college-of-osteopathic-medicine-tuncom",
    "name": "Touro University Nevada College of Osteopathic Medicine (TUNCOM)",
    "city": "Henderson",
    "state": "NV"
  },
  {
    "key": "university-of-the-incarnate-word-school-of-osteopathic-medicine-uiwsom",
    "name": "University of the Incarnate Word School of Osteopathic Medicine (UIWSOM)",
    "city": "San Antonio",
    "state": "TX"
  },
  {
    "key": "university-of-new-england-college-of-osteopathic-medicine-unecom",
    "name": "University of New England College of Osteopathic Medicine (UNECOM)",
    "city": "Biddeford",
    "state": "ME"
  },
  {
    "key": "university-of-north-texas-health-science-center-texas-college-of-osteopathic-medicine-unthsc-tcom",
    "name": "University of North Texas Health Science Center Texas College of Osteopathic Medicine (UNTHSC/TCOM)",
    "city": "Fort Worth",
    "state": "TX"
  },
  {
    "key": "university-of-pikeville-kentucky-college-of-osteopathic-medicine-up-kycom",
    "name": "University of Pikeville Kentucky College of Osteopathic Medicine (UP-KYCOM)",
    "city": "Pikeville",
    "state": "KY"
  },
  {
    "key": "west-virginia-school-of-osteopathic-medicine-wvsom",
    "name": "West Virginia School of Osteopathic Medicine (WVSOM)",
    "city": "Lewisburg",
    "state": "WV"
  },
  {
    "key": "western-university-of-health-sciences-college-of-osteopathic-medicine-of-the-pacific-westernu-comp",
    "name": "Western University of Health Sciences College of Osteopathic Medicine of the Pacific (WesternU/COMP)",
    "city": "Pomona",
    "state": "CA"
  },
  {
    "key": "western-university-of-health-sciences-college-of-osteopathic-medicine-of-the-pacific-northwest-westernu-comp-northwest",
    "name": "Western University of Health Sciences College of Osteopathic Medicine of the Pacific-Northwest (WesternU/COMP-Northwest)",
    "city": "Lebanon",
    "state": "OR"
  },
  {
    "key": "william-carey-university-college-of-osteopathic-medicine-wcucom",
    "name": "William Carey University College of Osteopathic Medicine (WCUCOM)",
    "city": "Hattiesburg",
    "state": "MS"
  }
];

const LAW_SCHOOLS = [
  {
    "key": "wilmington-university-school-of-law-provisional",
    "name": "Wilmington University School of Law (provisional)",
    "city": "",
    "state": ""
  },
  {
    "key": "jacksonville-university-college-of-law-provisional",
    "name": "Jacksonville University College of Law (provisional)",
    "city": "",
    "state": ""
  },
  {
    "key": "unt-dallas-college-of-law-provisional-since-2017",
    "name": "UNT Dallas College of Law (provisional since 2017)",
    "city": "",
    "state": ""
  },
  {
    "key": "mitchell-hamline-school-of-law",
    "name": "Mitchell Hamline School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "lincoln-memorial-university-school-of-law",
    "name": "Lincoln Memorial University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "belmont-university-college-of-law",
    "name": "Belmont University College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "umass-law",
    "name": "UMass Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-california-irvine-school-of-law",
    "name": "University of California, Irvine School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "drexel-university-school-of-law",
    "name": "Drexel University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "elon-university-school-of-law",
    "name": "Elon University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "charleston-school-of-law",
    "name": "Charleston School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "faulkner-university-thomas-goode-jones-school-of-law",
    "name": "Faulkner University, Thomas Goode Jones School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "liberty-university-school-of-law",
    "name": "Liberty University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "atlantas-john-marshall-law-school",
    "name": "Atlanta's John Marshall Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "western-state-college-of-law-at-westcliff-university-previously-approved-1998-2004-name-changed-from-argosy-university-in-2019",
    "name": "Western State College of Law at Westcliff University (previously approved 1998-2004, name changed from Argosy University in 2019)",
    "city": "",
    "state": ""
  },
  {
    "key": "florida-aandm-university-college-of-law",
    "name": "Florida A&M University College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "florida-international-university-college-of-law",
    "name": "Florida International University College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-st-thomas-school-of-law-minnesota",
    "name": "University of St. Thomas School of Law (Minnesota)",
    "city": "",
    "state": ""
  },
  {
    "key": "ave-maria-school-of-law",
    "name": "Ave Maria School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "barry-university-dwayne-o-andreas-school-of-law",
    "name": "Barry University, Dwayne O. Andreas School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "appalachian-school-of-law",
    "name": "Appalachian School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-nevada-las-vegas-william-s-boyd-school-of-law",
    "name": "University of Nevada-Las Vegas, William S. Boyd School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "chapman-university-school-of-law",
    "name": "Chapman University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "roger-williams-university-school-of-law",
    "name": "Roger Williams University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "seattle-university-school-of-law",
    "name": "Seattle University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "texas-aandm-university-school-of-law-formerly-texas-wesleyan-school-of-law",
    "name": "Texas A&M University School of Law (formerly Texas Wesleyan School of Law)",
    "city": "",
    "state": ""
  },
  {
    "key": "quinnipiac-university-school-of-law",
    "name": "Quinnipiac University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-the-district-of-columbia-david-a-clarke-school-of-law",
    "name": "University of the District of Columbia, David A. Clarke School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "regent-university-school-of-law",
    "name": "Regent University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "st-thomas-university-college-of-law-florida-previously-school-of-law",
    "name": "St. Thomas University College of Law (Florida) (previously School of Law)",
    "city": "",
    "state": ""
  },
  {
    "key": "widener-university-commonwealth-law-school",
    "name": "Widener University-Commonwealth Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "city-university-of-new-york-school-of-law",
    "name": "City University of New York School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "georgia-state-university-college-of-law",
    "name": "Georgia State University College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "touro-college-jacob-d-fuchsberg-law-center-named-touro-university-in-2022",
    "name": "Touro College, Jacob D. Fuchsberg Law Center (named Touro University in 2022)",
    "city": "",
    "state": ""
  },
  {
    "key": "george-mason-university-school-of-law",
    "name": "George Mason University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "mississippi-college-school-of-law",
    "name": "Mississippi College School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "campbell-university-norman-adrian-wiggins-school-of-law",
    "name": "Campbell University, Norman Adrian Wiggins School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "northern-illinois-university-college-of-law",
    "name": "Northern Illinois University College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "pace-university-school-of-law",
    "name": "Pace University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "yeshiva-university-benjamin-n-cardozo-school-of-law",
    "name": "Yeshiva University, Benjamin N. Cardozo School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-dayton-school-of-law",
    "name": "University of Dayton School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "hamline-university-school-of-law-now-mitchell-hamline-school-of-law",
    "name": "Hamline University School of Law (now Mitchell | Hamline School of Law)",
    "city": "",
    "state": ""
  },
  {
    "key": "nova-southeastern-university-shepard-broad-law-center",
    "name": "Nova Southeastern University, Shepard Broad Law Center",
    "city": "",
    "state": ""
  },
  {
    "key": "cooley-law-school",
    "name": "Cooley Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "vermont-law-school",
    "name": "Vermont Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "widener-university-delaware-law-school",
    "name": "Widener University-Delaware Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "brigham-young-university-j-reuben-clark-law-school",
    "name": "Brigham Young University, J. Reuben Clark Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-hawaii-william-s-richardson-school-of-law",
    "name": "University of Hawai'i, William S. Richardson School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-new-hampshire-school-of-law",
    "name": "University of New Hampshire School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "southern-illinois-university-school-of-law",
    "name": "Southern Illinois University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "western-new-england-college-school-of-law",
    "name": "Western New England College School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-baltimore-school-of-law",
    "name": "University of Baltimore School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "pepperdine-university-school-of-law",
    "name": "Pepperdine University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "hofstra-university-school-of-law",
    "name": "Hofstra University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "lewis-and-clark-college-law-school",
    "name": "Lewis and Clark College Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "southwestern-law-school",
    "name": "Southwestern Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "arizona-state-university-sandra-day-oconnor-college-of-law",
    "name": "Arizona State University, Sandra Day O'Connor College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-arkansas-at-little-rock-william-h-bowen-school-of-law",
    "name": "University of Arkansas at Little Rock, William H. Bowen School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "inter-american-university-of-puerto-rico-school-of-law",
    "name": "Inter American University of Puerto Rico, School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "mcgeorge-school-of-law-the-university-of-the-pacific",
    "name": "McGeorge School of Law, The University of the Pacific",
    "city": "",
    "state": ""
  },
  {
    "key": "new-england-law-boston",
    "name": "New England Law | Boston",
    "city": "",
    "state": ""
  },
  {
    "key": "northeastern-university-school-of-law",
    "name": "Northeastern University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "texas-tech-university-school-of-law",
    "name": "Texas Tech University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-california-davis-school-of-law",
    "name": "University of California-Davis, School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "florida-state-university-college-of-law",
    "name": "Florida State University College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "pontifical-catholic-university-of-puerto-rico-school-of-law",
    "name": "Pontifical Catholic University of Puerto Rico School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-memphis-school-of-law",
    "name": "University of Memphis School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "california-western-school-of-law",
    "name": "California Western School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-maine-school-of-law",
    "name": "University of Maine School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "the-university-of-akron-school-of-law",
    "name": "The University of Akron School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-san-diego-school-of-law",
    "name": "University of San Diego School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "duquesne-university-school-of-law",
    "name": "Duquesne University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "oklahoma-city-university-college-of-law",
    "name": "Oklahoma City University College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "south-texas-college-of-law-houston",
    "name": "South Texas College of Law-Houston",
    "city": "",
    "state": ""
  },
  {
    "key": "judge-advocate-generals-legal-center-and-school",
    "name": "Judge Advocate General's Legal Center and School",
    "city": "",
    "state": ""
  },
  {
    "key": "cleveland-state-university-college-of-law",
    "name": "Cleveland State University College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "golden-gate-university-school-of-law",
    "name": "Golden Gate University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "new-york-law-school",
    "name": "New York Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "northern-kentucky-university-salmon-p-chase-college-of-law",
    "name": "Northern Kentucky University, Salmon P. Chase College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "villanova-university-school-of-law",
    "name": "Villanova University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "southern-university-law-center",
    "name": "Southern University Law Center",
    "city": "",
    "state": ""
  },
  {
    "key": "suffolk-university-law-center",
    "name": "Suffolk University Law Center",
    "city": "",
    "state": ""
  },
  {
    "key": "gonzaga-university-school-of-law",
    "name": "Gonzaga University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-illinois-chicago-school-of-law-formerly-uic-john-marshall",
    "name": "University of Illinois Chicago School of Law (formerly UIC John Marshall)",
    "city": "",
    "state": ""
  },
  {
    "key": "seton-hall-university-school-of-law",
    "name": "Seton Hall University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-california-los-angeles-school-of-law",
    "name": "University of California-Los Angeles, School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "capital-university-law-school",
    "name": "Capital University Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-houston-law-center",
    "name": "University of Houston Law Center",
    "city": "",
    "state": ""
  },
  {
    "key": "north-carolina-central-university-school-of-law",
    "name": "North Carolina Central University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "rutgers-school-of-law-camden",
    "name": "Rutgers School of Law-Camden",
    "city": "",
    "state": ""
  },
  {
    "key": "the-university-of-tulsa-college-of-law",
    "name": "The University of Tulsa College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "samford-university-cumberland-school-of-law",
    "name": "Samford University, Cumberland School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "texas-southern-university-thurgood-marshall-school-of-law",
    "name": "Texas Southern University, Thurgood Marshall School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "the-university-of-new-mexico-school-of-law",
    "name": "The University of New Mexico School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "ohio-northern-university-claude-w-pettit-college-of-law",
    "name": "Ohio Northern University-Claude W. Pettit College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "st-marys-university-school-of-law",
    "name": "St. Mary's University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-puerto-rico-school-of-law",
    "name": "University of Puerto Rico School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "indiana-university-robert-h-mckinney-school-of-law-indianapolis",
    "name": "Indiana University Robert H. McKinney School of Law (Indianapolis)",
    "city": "",
    "state": ""
  },
  {
    "key": "detroit-college-of-law-now-michigan-state-university-college-of-law",
    "name": "Detroit College of Law (now Michigan State University College of Law)",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-miami-school-of-law",
    "name": "University of Miami School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "rutgers-school-of-law-newark",
    "name": "Rutgers School of Law - Newark",
    "city": "",
    "state": ""
  },
  {
    "key": "american-university-washington-college-of-law",
    "name": "American University, Washington College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-california-college-of-the-law-san-francisco-previously-hastings-school-of-law",
    "name": "University of California College of the Law, San Francisco (Previously Hastings, School of Law)",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-toledo-college-of-law",
    "name": "University of Toledo College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "willamette-university-college-of-law",
    "name": "Willamette University College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "william-mitchell-college-of-law-now-mitchell-hamline-school-of-law",
    "name": "William Mitchell College of Law (now Mitchell | Hamline School of Law)",
    "city": "",
    "state": ""
  },
  {
    "key": "brooklyn-law-school",
    "name": "Brooklyn Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "st-johns-university-school-of-law",
    "name": "St. John's University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "santa-clara-university-school-of-law",
    "name": "Santa Clara University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "wayne-state-university-law-school",
    "name": "Wayne State University Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "chicago-kent-college-of-law-illinois-institute-of-technology",
    "name": "Chicago-Kent College of Law, Illinois Institute of Technology",
    "city": "",
    "state": ""
  },
  {
    "key": "fordham-university-school-of-law",
    "name": "Fordham University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-missouri-kansas-city-school-of-law",
    "name": "University of Missouri-Kansas City School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-at-buffalo-school-of-law",
    "name": "University at Buffalo School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "wake-forest-university-school-of-law",
    "name": "Wake Forest University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "loyola-law-school-los-angeles",
    "name": "Loyola Law School-Los Angeles",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-san-francisco-school-of-law",
    "name": "University of San Francisco School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-connecticut-school-of-law",
    "name": "University of Connecticut School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-detroit-mercy-school-of-law",
    "name": "University of Detroit Mercy School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "temple-university-james-e-beasley-school-of-law",
    "name": "Temple University, James E. Beasley School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "boston-college-law-school",
    "name": "Boston College Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "college-of-william-and-mary-marshall-wythe-law-school",
    "name": "College of William and Mary, Marshall-Wythe Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "baylor-university-sheila-and-walter-umphrey-law-center",
    "name": "Baylor University, Sheila & Walter Umphrey Law Center",
    "city": "",
    "state": ""
  },
  {
    "key": "duke-university-school-of-law",
    "name": "Duke University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "howard-university-school-of-law",
    "name": "Howard University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-louisville-louis-d-brandeis-school-of-law",
    "name": "University of Louisville, Louis D. Brandeis School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "loyola-university-new-orleans-college-of-law",
    "name": "Loyola University - New Orleans College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "dickinson-school-of-law-now-penn-state-dickinson-law",
    "name": "Dickinson School of Law (now Penn State-Dickinson Law)",
    "city": "",
    "state": ""
  },
  {
    "key": "pennsylvania-state-university-penn-state-law-now-penn-state-dickinson-law",
    "name": "Pennsylvania State University-Penn State Law )now Penn State-Dickinson Law)",
    "city": "",
    "state": ""
  },
  {
    "key": "albany-law-school",
    "name": "Albany Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "the-university-of-arizona-james-e-rogers-college-of-law",
    "name": "The University of Arizona, James E. Rogers College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-georgia-school-of-law",
    "name": "University of Georgia School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-maryland-school-of-law",
    "name": "University of Maryland School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-mississippi-school-of-law",
    "name": "University of Mississippi School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "new-york-university-school-of-law",
    "name": "New York University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "stetson-university-school-of-law",
    "name": "Stetson University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-richmond-school-of-law-formerly-tc-williams-school-of-law",
    "name": "University of Richmond, School of Law (formerly T.C. Williams School of Law)",
    "city": "",
    "state": ""
  },
  {
    "key": "southern-methodist-university-dedman-school-of-law",
    "name": "Southern Methodist University, Dedman School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-utah-sj-quinney-college-of-law",
    "name": "University of Utah, S.J. Quinney College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "the-university-of-alabama-school-of-law",
    "name": "The University of Alabama School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "the-university-of-arkansas-school-of-law-fayetteville",
    "name": "The University of Arkansas School of Law-Fayetteville",
    "city": "",
    "state": ""
  },
  {
    "key": "louisiana-state-university-paul-m-hebert-law-center",
    "name": "Louisiana State University, Paul M. Hebert Law Center",
    "city": "",
    "state": ""
  },
  {
    "key": "boston-university-school-of-law",
    "name": "Boston University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "the-catholic-university-of-america-columbus-school-of-law",
    "name": "The Catholic University of America, Columbus School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "depaul-university-school-of-law",
    "name": "DePaul University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-florida-fredric-g-levin-college-of-law",
    "name": "University of Florida, Fredric G. Levin College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-idaho-college-of-law",
    "name": "University of Idaho College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-kentucky-college-of-law",
    "name": "University of Kentucky College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "loyola-university-chicago-school-of-law",
    "name": "Loyola University-Chicago School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "marquette-university-law-school",
    "name": "Marquette University Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "mercer-university-walter-f-george-school-of-law",
    "name": "Mercer University, Walter F. George School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-notre-dame-law-school",
    "name": "University of Notre Dame Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-south-carolina-school-of-law",
    "name": "University of South Carolina School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "the-university-of-tennessee-college-of-law",
    "name": "The University of Tennessee College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "tulane-university-law-school",
    "name": "Tulane University Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "vanderbilt-university-law-school",
    "name": "Vanderbilt University Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "creighton-university-school-of-law",
    "name": "Creighton University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "georgetown-university-law-center",
    "name": "Georgetown University Law Center",
    "city": "",
    "state": ""
  },
  {
    "key": "saint-louis-university-school-of-law",
    "name": "Saint Louis University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-southern-california-gould-school-of-law",
    "name": "University of Southern California, Gould School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-washington-school-of-law",
    "name": "University of Washington School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-california-berkeley-college-of-law",
    "name": "University of California-Berkeley, College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "case-western-reserve-university-school-of-law",
    "name": "Case Western Reserve University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-chicago-law-school",
    "name": "University of Chicago Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-cincinnati-college-of-law",
    "name": "University of Cincinnati College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-colorado-law-school",
    "name": "University of Colorado Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "columbia-university-law-school",
    "name": "Columbia University Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "cornell-university-law-school",
    "name": "Cornell University Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-denver-sturm-college-of-law",
    "name": "University of Denver Sturm College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "drake-university-law-school",
    "name": "Drake University Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "emory-university-school-of-law",
    "name": "Emory University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "the-george-washington-university-law-school",
    "name": "The George Washington University Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "harvard-university-law-school",
    "name": "Harvard University Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-illinois-college-of-law",
    "name": "University of Illinois College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "indiana-university-maurer-school-of-law-bloomington",
    "name": "Indiana University Maurer School of Law (Bloomington)",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-iowa-college-of-law",
    "name": "University of Iowa College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-kansas-school-of-law",
    "name": "University of Kansas School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-michigan-law-school",
    "name": "University of Michigan Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-minnesota-law-school",
    "name": "University of Minnesota Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-missouri-school-of-law",
    "name": "University of Missouri School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "the-university-of-montana-school-of-law",
    "name": "The University of Montana School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-nebraska-college-of-law",
    "name": "University of Nebraska College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-north-carolina-at-chapel-hill-school-of-law",
    "name": "University of North Carolina at Chapel Hill School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-north-dakota-school-of-law",
    "name": "University of North Dakota School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "northwestern-university-school-of-law",
    "name": "Northwestern University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "the-ohio-state-university-michael-e-moritz-college-of-law",
    "name": "The Ohio State University, Michael E. Moritz College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-oklahoma-college-of-law",
    "name": "University of Oklahoma College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-oregon-school-of-law",
    "name": "University of Oregon School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-pennsylvania-law-school",
    "name": "University of Pennsylvania Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-pittsburgh-school-of-law",
    "name": "University of Pittsburgh School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-south-dakota-school-of-law",
    "name": "University of South Dakota School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "stanford-university-law-school",
    "name": "Stanford University Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "syracuse-university-college-of-law",
    "name": "Syracuse University College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "the-university-of-texas-school-of-law",
    "name": "The University of Texas School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-virginia-school-of-law",
    "name": "University of Virginia School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "washburn-university-school-of-law",
    "name": "Washburn University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "washington-and-lee-university-school-of-law",
    "name": "Washington and Lee University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "washington-university-school-of-law",
    "name": "Washington University School of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "west-virginia-university-college-of-law",
    "name": "West Virginia University College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-wisconsin-law-school",
    "name": "University of Wisconsin Law School",
    "city": "",
    "state": ""
  },
  {
    "key": "university-of-wyoming-college-of-law",
    "name": "University of Wyoming College of Law",
    "city": "",
    "state": ""
  },
  {
    "key": "yale-university-law-school",
    "name": "Yale University Law School",
    "city": "",
    "state": ""
  }
];
const DENTAL_SCHOOLS = [
  // Alabama
  { key: "uab", name: "University of Alabama School of Dentistry", city: "Birmingham", state: "AL" },

  // Arizona
  { key: "atsu-az", name: "Arizona School of Dentistry & Oral Health (ATSU)", city: "Mesa", state: "AZ" },
  { key: "midwestern-az", name: "Midwestern University College of Dental Medicine–Arizona", city: "Glendale", state: "AZ" },

  // Arkansas
  { key: "lyon", name: "Lyon College School of Dental Medicine", city: "Batesville", state: "AR", note: "opening July 2025" },

  // California
  { key: "cnsu", name: "California Northstate University College of Dental Medicine", city: "Elk Grove", state: "CA" },
  { key: "usc", name: "Herman Ostrow School of Dentistry of USC", city: "Los Angeles", state: "CA" },
  { key: "loma-linda", name: "Loma Linda University School of Dentistry", city: "Loma Linda", state: "CA" },
  { key: "ucla", name: "University of California, Los Angeles School of Dentistry", city: "Los Angeles", state: "CA" },
  { key: "ucsf", name: "University of California, San Francisco School of Dentistry", city: "San Francisco", state: "CA" },
  { key: "pacific-dugoni", name: "University of the Pacific Arthur A. Dugoni School of Dentistry", city: "San Francisco", state: "CA" },
  { key: "westernu", name: "Western University of Health Sciences College of Dental Medicine", city: "Pomona", state: "CA" },

  // Colorado
  { key: "cu", name: "University of Colorado School of Dental Medicine", city: "Aurora", state: "CO" },

  // Connecticut
  { key: "uconn", name: "University of Connecticut School of Dental Medicine", city: "Farmington", state: "CT" },

  // District of Columbia
  { key: "howard", name: "Howard University College of Dentistry", city: "Washington", state: "DC" },

  // Florida
  { key: "lecom", name: "LECOM School of Dental Medicine", city: "Bradenton", state: "FL" },
  { key: "nova", name: "Nova Southeastern University College of Dental Medicine", city: "Ft. Lauderdale", state: "FL" },
  { key: "uf", name: "University of Florida College of Dentistry", city: "Gainesville", state: "FL" },

  // Georgia
  { key: "augusta", name: "The Dental College of Georgia at Augusta University", city: "Augusta", state: "GA" },

  // Illinois
  { key: "uic", name: "University of Illinois Chicago College of Dentistry", city: "Chicago", state: "IL" },
  { key: "midwestern-il", name: "Midwestern University College of Dental Medicine–Illinois", city: "Downers Grove", state: "IL" },
  { key: "siu", name: "Southern Illinois University School of Dental Medicine", city: "Alton", state: "IL" },

  // Indiana
  { key: "iu", name: "Indiana University School of Dentistry", city: "Indianapolis", state: "IN" },

  // Iowa
  { key: "uiowa", name: "The University of Iowa College of Dentistry and Dental Clinics", city: "Iowa City", state: "IA" },

  // Kentucky
  { key: "uky", name: "University of Kentucky College of Dentistry", city: "Lexington", state: "KY" },
  { key: "ul", name: "University of Louisville School of Dentistry", city: "Louisville", state: "KY" },

  // Louisiana
  { key: "lsu", name: "Louisiana State University Health Sciences Center School of Dentistry", city: "New Orleans", state: "LA" },

  // Maine
  { key: "une", name: "University of New England College of Dental Medicine", city: "Portland", state: "ME" },

  // Maryland
  { key: "umaryland", name: "University of Maryland School of Dentistry", city: "Baltimore", state: "MD" },

  // Massachusetts
  { key: "bu", name: "Boston University Henry M. Goldman School of Dental Medicine", city: "Boston", state: "MA" },
  { key: "harvard", name: "Harvard School of Dental Medicine", city: "Boston", state: "MA" },
  { key: "tufts", name: "Tufts University School of Dental Medicine", city: "Boston", state: "MA" },

  // Michigan
  { key: "udm", name: "University of Detroit Mercy School of Dentistry", city: "Detroit", state: "MI" },
  { key: "umich", name: "University of Michigan School of Dentistry", city: "Ann Arbor", state: "MI" },

  // Minnesota
  { key: "umn", name: "University of Minnesota School of Dentistry", city: "Minneapolis", state: "MN" },

  // Mississippi
  { key: "umc", name: "University of Mississippi Medical Center School of Dentistry", city: "Jackson", state: "MS" },

  // Missouri
  { key: "kcu", name: "Kansas City University College of Dental Medicine", city: "Joplin", state: "MO" },
  { key: "atsu-mo", name: "Missouri School of Dentistry & Oral Health (ATSU)", city: "Kirksville", state: "MO" },
  { key: "umkc", name: "University of Missouri–Kansas City School of Dentistry", city: "Kansas City", state: "MO" },

  // Nebraska
  { key: "creighton", name: "Creighton University School of Dentistry", city: "Omaha", state: "NE" },
  { key: "unmc", name: "University of Nebraska Medical Center College of Dentistry", city: "Lincoln", state: "NE" },

  // Nevada
  { key: "unlv", name: "University of Nevada, Las Vegas School of Dental Medicine", city: "Las Vegas", state: "NV" },

  // New Jersey
  { key: "rutgers", name: "Rutgers School of Dental Medicine", city: "Newark", state: "NJ" },

  // New York
  { key: "columbia", name: "Columbia University College of Dental Medicine", city: "New York", state: "NY" },
  { key: "nyu", name: "New York University College of Dentistry", city: "New York", state: "NY" },
  { key: "stony-brook", name: "Stony Brook University School of Dental Medicine", city: "Stony Brook", state: "NY" },
  { key: "touro", name: "Touro College of Dental Medicine at New York Medical College", city: "Hawthorne", state: "NY" },
  { key: "buffalo", name: "University at Buffalo School of Dental Medicine", city: "Buffalo", state: "NY" },

  // North Carolina
  { key: "ecu", name: "East Carolina University School of Dental Medicine", city: "Greenville", state: "NC" },
  { key: "hpu", name: "High Point University School of Dental Medicine and Oral Health", city: "High Point", state: "NC" },
  { key: "unc", name: "University of North Carolina Chapel Hill School of Dentistry", city: "Chapel Hill", state: "NC" },

  // Ohio
  { key: "cwr", name: "Case Western Reserve University School of Dental Medicine", city: "Cleveland", state: "OH" },
  { key: "neomed", name: "Northeast Ohio Medical University Bitonte School of Dentistry", city: "Rootstown", state: "OH", note: "opening July 2025" },
  { key: "osu", name: "Ohio State University College of Dentistry", city: "Columbus", state: "OH" },

  // Oklahoma
  { key: "ou", name: "University of Oklahoma College of Dentistry", city: "Oklahoma City", state: "OK" },

  // Oregon
  { key: "ohsu", name: "Oregon Health & Science University School of Dentistry", city: "Portland", state: "OR" },

  // Pennsylvania
  { key: "penn", name: "University of Pennsylvania School of Dental Medicine", city: "Philadelphia", state: "PA" },
  { key: "pitt", name: "University of Pittsburgh School of Dental Medicine", city: "Pittsburgh", state: "PA" },
  { key: "temple", name: "Temple University Kornberg School of Dentistry", city: "Philadelphia", state: "PA" },

  // Puerto Rico
  { key: "upr", name: "University of Puerto Rico School of Dental Medicine", city: "San Juan", state: "PR" },
  { key: "uagm", name: "Universidad Ana G. Méndez School of Dental Medicine", city: "Gurabo", state: "PR" },
  { key: "ponce", name: "Ponce Health Sciences University School of Dental Medicine", city: "Ponce", state: "PR" },

  // South Carolina
  { key: "musc", name: "Medical University of South Carolina College of Dental Medicine", city: "Charleston", state: "SC" },

  // Tennessee
  { key: "lmu", name: "Lincoln Memorial University–College of Dental Medicine", city: "Knoxville", state: "TN" }, // add city if you want to fix
  { key: "meharry", name: "Meharry Medical College School of Dentistry", city: "Nashville", state: "TN" },
  { key: "uthsc", name: "University of Tennessee Health Science Center College of Dentistry", city: "Memphis", state: "TN" },

  // Texas
  { key: "tamudallas", name: "Texas A&M University College of Dentistry", city: "Dallas", state: "TX" },
  { key: "ttuhsc-elpaso", name: "Texas Tech University Health Sciences Center El Paso — Hunt School of Dentistry", city: "El Paso", state: "TX" },
  { key: "uth-houston", name: "University of Texas Health Science Center at Houston School of Dentistry", city: "Houston", state: "TX" },
  { key: "utsa", name: "University of Texas Health Science Center at San Antonio School of Dentistry", city: "San Antonio", state: "TX" },

  // Utah
  { key: "roseman", name: "Roseman University of Health Sciences College of Dental Medicine", city: "South Jordan", state: "UT" },
  { key: "utah", name: "University of Utah School of Dentistry", city: "Salt Lake City", state: "UT" },

  // Virginia
  { key: "vcu", name: "Virginia Commonwealth University School of Dentistry", city: "Richmond", state: "VA" },

  // Washington
  { key: "pnwu", name: "Pacific Northwest University School of Dental Medicine", city: "Yakima", state: "WA", note: "opening July 2025" },
  { key: "uw", name: "University of Washington School of Dentistry", city: "Seattle", state: "WA" },

  // West Virginia
  { key: "wvu", name: "West Virginia University School of Dentistry", city: "Morgantown", state: "WV" },

  // Wisconsin
  { key: "marquette", name: "Marquette University School of Dentistry", city: "Milwaukee", state: "WI" },
];

const SCHOOL_BANKS = {
  dental: { label: "Dental",  gradient: "from-pink-500 via-fuchsia-500 to-violet-500",  list: DENTAL_SCHOOLS },
  med:    { label: "Medical", gradient: "from-emerald-500 via-teal-500 to-sky-500",     list: MED_SCHOOLS },
  law:    { label: "Law",     gradient: "from-amber-500 via-orange-500 to-rose-500",    list: LAW_SCHOOLS },
};

// pastel fallback
const pastelColors = [
  "#FDE68A",
  "#FBCFE8",
  "#BFDBFE",
  "#C7D2FE",
  "#A7F3D0",
  "#FCA5A5",
  "#E9D5FF",
  "#99F6E4",
  "#FDE2E4",
  "#FFD6A5",
];

// rainbow helpers
function rainbowColor(i, total, sat = 72, light = 60) {
  const hue = Math.round((360 * i) / Math.max(total, 1));
  return `hsl(${hue} ${sat}% ${light}%)`;
}
function rainbowAlpha(i, total, alpha = 0.15) {
  const hue = Math.round((360 * i) / Math.max(total, 1));
  return `hsla(${hue}, 80%, 60%, ${alpha})`;
}

// small utils
const makeId = () => Math.random().toString(36).slice(2, 9);
function shorten(str, n) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}
function parseNumberOrNull(v) {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function safeKey(s) {
  return (
    String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 32) || `k_${makeId()}`
  );
}

// storage
const STORAGE_KEY = "dental-ranking-data-v1";

// master criteria
// this is your master list of criteria — neutral + generally applicable
const ALL_CRITERIA = [
  {
    key: "price",
    label: "Cost / COA",
    higherIsBetter: false,
    tip: "Total cost of attendance or best estimate. Lower is better.",
  },
  {
    key: "cityLike",
    label: "Location Fit",
    higherIsBetter: true,
    tip: "How much you'd actually want to live there (0–10).",
  },
  {
    key: "weatherWarmth",
    label: "Weather / Climate",
    higherIsBetter: true,
    tip: "Warmer / nicer weather scores higher.",
  },
  {
    key: "looks",
    label: "Campus / Facility Aesthetic",
    higherIsBetter: true,
    tip: "How nice the school, clinic, and facilities look to you.",
  },
  {
    key: "curriculum",
    label: "Curriculum / Schedule",
    higherIsBetter: true,
    tip: "Block vs traditional, P/F, exam spread, built-in study time.",
  },
  {
    key: "clinical",
    label: "Clinical Exposure",
    higherIsBetter: true,
    tip: "How early/often you get patients, rotations, and real cases.",
  },
  {
    key: "timeline",
    label: "Breaks / Academic Calendar",
    higherIsBetter: true,
    tip: "More breaks or better-distributed ones = higher score.",
  },
];


// what shows up for brand-new users
const CRITERIA_DEFAULT = [
  { key: "price", label: "Cost / COA", higherIsBetter: false, tip: "Lower is better." },
  { key: "cityLike", label: "Location Fit", higherIsBetter: true, tip: "Do I want to live here?" },
  { key: "weatherWarmth", label: "Weather / Climate", higherIsBetter: true, tip: "Nicer climate scores higher." },
  { key: "looks", label: "Campus / Facility Aesthetic", higherIsBetter: true, tip: "How good the school looks to you." },
  { key: "curriculum", label: "Curriculum / Schedule", higherIsBetter: true, tip: "Flexible, chill, or P/F → higher." },
  { key: "clinical", label: "Clinical Exposure", higherIsBetter: true, tip: "Earlier/more patients → higher." },
  { key: "timeline", label: "Breaks / Academic Calendar", higherIsBetter: true, tip: "More breaks → better." },
];


const defaultWeights = {
  price: 18,
  cityLike: 16,
  weatherWarmth: 8,
  looks: 10,
  curriculum: 14,
  clinical: 18,
  timeline: 8,
};


// normalization
function minMax(values) {
  const nums = values.filter((v) => typeof v === "number" && !Number.isNaN(v));
  if (nums.length === 0) return { scale: () => 50 };
  const mn = Math.min(...nums);
  const mx = Math.max(...nums);
  if (mn === mx) return { scale: () => 50 };
  return {
    scale: (v) =>
      v == null || Number.isNaN(Number(v)) ? 50 : ((Number(v) - mn) / (mx - mn)) * 100,
  };
}
function normalizeCriterion(rows, key, higherIsBetter) {
  const scaler = minMax(rows.map((r) => r[key]));
  return rows.map((r) => {
    const s = scaler.scale(r[key]);
    return higherIsBetter ? s : 100 - s;
  });
}

/* -------------------- LANDING -------------------- */

function AlignMyNextLanding({ onGuest, onSignIn }) {
  const [mode, setMode] = React.useState("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [forgotOpen, setForgotOpen] = React.useState(false); // ADD


  async function handleSignIn(e) {
    e?.preventDefault?.();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data?.session?.user) {
      onSignIn?.({
        user: { id: data.session.user.id, email: data.session.user.email },
      });
    } else if (data?.user) {
      onSignIn?.({ user: { id: data.user.id, email: data.user.email } });
    }
  }

  async function handleSignUp(e) {
    e?.preventDefault?.();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data?.user) {
      onSignIn?.({ user: { id: data.user.id, email: data.user.email } });
    }
  }

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-6
        bg-[radial-gradient(1200px_600px_at_0%_0%,#fff0,rgba(255,0,122,0.12)),radial-gradient(900px_600px_at_100%_0%,#fff0,rgba(0,255,150,0.12))]
        transition-all duration-300`}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/20 backdrop-blur-xl shadow-2xl p-6 md:p-8 space-y-6">
        {/* title */}
        <div className="text-center space-y-4">
  <h1 className="font-heading text-4xl font-extrabold tracking-tight rainbow-text">
    AlignMyNext
  </h1>


  <p className="text-sm rainbow-text">
    Where Data Meets Destiny
  </p>

 {/* Explainer — all bold */}
<div className="rounded-2xl border border-white/30 bg-white/25 backdrop-blur-md p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)] text-center">
  <p className="text-sm md:text-[12px] font-semibold text-slate-800 leading-relaxed">
    Rate dental schools, law schools, or medical schools based on your priorities and watch a live, weighted ranking update in real time.
  </p>

  <p className="text-center italic text-xs text-slate-500 mt-2">
    Create an account to save your progress!
    </p>
  </div>
</div>


        {/* tabs */}
        <div className="flex rounded-2xl bg-white/20 p-1 gap-1">
  <button
    onClick={() => { setMode("signin"); setError(""); }}
    className={`flex-1 py-2 rounded-xl text-sm font-medium ${
      mode === "signin" ? "bg-white/90 text-black" : "text-black"
    }`}
  >
    Sign in
  </button>
  <button
    onClick={() => { setMode("signup"); setError(""); }}
    className={`flex-1 py-2 rounded-xl text-sm font-medium ${
      mode === "signup" ? "bg-white/90 text-black" : "text-black"
    }`}
  >
    Create account
  </button>
  <button
    onClick={() => onGuest?.()}
    className="flex-1 py-2 rounded-xl text-sm font-medium text-black hover:bg-white/10"
  >
    Guest
  </button>
</div>

        {/* form */}
        <form
          onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
          className="space-y-4"
        >
          <div>
            <label className="text-xs rainbow-text">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 bg-white/80 outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs rainbow-text">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 bg-white/80 outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="text-xs text-slate-600 hover:underline"
          >
            Forgot your password?
          </button>

          {error && (
            <div className="text-xs text-rose-100 bg-rose-500/30 border border-rose-200/60 rounded-xl px-3 py-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl py-2.5 text-sm font-semibold text-white bg-[linear-gradient(90deg,#f97316,#ec4899,#6366f1)] hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? mode === "signin"
                ? "Signing in…"
                : "Creating account…"
              : mode === "signin"
              ? "Sign in"
              : "Create account"}
          </button>
        </form>

        <p className="text-[10px] rainbow-text text-center">
          Or continue as guest – data will be saved to this browser only.
        </p>
        {forgotOpen && <ForgotPasswordModal onClose={() => setForgotOpen(false)} />}
      </div>
    </div>
  );
}

/* -------------------- MAIN APP -------------------- */

export default function DentalRankingApp() {
  // 1. auth gate
  const [session, setSession] = useState(null);
  const [guestMode, setGuestMode] = useState(() => {
    return localStorage.getItem("AlignMyNext_guest") === "1";
  });

  function onSignedIn(sessionObj) {
    setSession(sessionObj);
    localStorage.removeItem("AlignMyNext_guest");
    setGuestMode(false);
  }

  function continueAsGuest() {
    localStorage.setItem("AlignMyNext_guest", "1");
    setGuestMode(true);
    setSession(null);
  }

  async function signOutEverywhere() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("supabase signout failed (ok in guest):", e);
    }
    setSession(null);
    localStorage.removeItem("AlignMyNext_guest");
    setGuestMode(false);
  }

  // 2. core UI state
  const [schools, setSchools] = useState([]);
  const [weights, setWeights] = useState({});
  const [rainbowMode, setRainbowMode] = useState(true);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [criteria, setCriteria] = useState(ALL_CRITERIA);
  const [enabledCriteriaKeys, setEnabledCriteriaKeys] = useState([]);
  const [activeTab, setActiveTab] = useState("data");
  const [addOpen, setAddOpen] = useState(false);
  const [newCrit, setNewCrit] = useState({
    label: "",
    key: "",
    higherIsBetter: true,
    tip: "",
  });
  const [addError, setAddError] = useState("");
  const [raterOpen, setRaterOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  // NEW — dropdown picker for Add School
  const [addPickerOpen, setAddPickerOpen] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [selectedBankKey, setSelectedBankKey] = useState(DENTAL_SCHOOLS[0]?.key ?? null);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  // derive the active list for the chosen bank
const activeList = React.useMemo(
  () => (bankId ? SCHOOL_BANKS[bankId].list : []),
  [bankId]
);


  // cloud
  const [user, setUser] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [saving, setSaving] = useState("idle");

  // 3. load
  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await getUser();
      if (!mounted) return;
      setUser(u);

      if (u) {
        const id = await ensureUserRanking(u.id);
        if (!mounted) return;
        setRecordId(id);

        const cloud = await loadData(id);
        if (!mounted) return;
        if (cloud) {
          if (Array.isArray(cloud.schools)) setSchools(cloud.schools);
          if (cloud.weights && typeof cloud.weights === "object")
            setWeights(cloud.weights);
          if (Array.isArray(cloud.enabledCriteriaKeys))
            setEnabledCriteriaKeys(cloud.enabledCriteriaKeys);
          if (typeof cloud.rainbowMode === "boolean")
            setRainbowMode(cloud.rainbowMode);
        }
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.schools)) setSchools(parsed.schools);
            if (parsed.weights && typeof parsed.weights === "object")
              setWeights(parsed.weights);
            if (Array.isArray(parsed.enabledCriteriaKeys))
              setEnabledCriteriaKeys(parsed.enabledCriteriaKeys);
            if (typeof parsed.rainbowMode === "boolean")
              setRainbowMode(parsed.rainbowMode);
          }
        } catch (e) {
          console.warn("Local load failed", e);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 4. autosave
  useEffect(() => {
    const payload = { schools, weights, enabledCriteriaKeys, rainbowMode };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}

    if (!user || !recordId) return;

    setSaving("saving");
    const t = setTimeout(async () => {
      try {
        await saveData(recordId, payload);
        setSaving("saved");
        setTimeout(() => setSaving("idle"), 1200);
      } catch (e) {
        console.error(e);
        setSaving("idle");
      }
    }, 600);

    return () => clearTimeout(t);
  }, [user, recordId, schools, weights, enabledCriteriaKeys, rainbowMode]);

  // --- listen for password-recovery redirect from Supabase ---
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setResetOpen(true);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const h = window.location.hash || "";
    const q = window.location.search || "";
    if (h.includes("type=recovery") || q.includes("type=recovery") || window.location.pathname === "/reset") {
      setResetOpen(true);
    }
  }, []);

  // 5. derived
  const ACTIVE = useMemo(
    () => ALL_CRITERIA.filter((c) => enabledCriteriaKeys.includes(c.key)),
    [enabledCriteriaKeys]
  );

  const totalWeight = useMemo(
    () => ACTIVE.reduce((sum, c) => sum + Number(weights[c.key] || 0), 0),
    [weights, ACTIVE]
  );

  const rowsWithScores = useMemo(() => {
    if (!schools.length) return [];

    if (!ACTIVE.length) {
      return schools.map((s, i) => ({ ...s, composite: 0, rank: i + 1 }));
    }

    const norm = {};
    ACTIVE.forEach((c) => {
      norm[c.key] = normalizeCriterion(schools, c.key, c.higherIsBetter);
    });

    const denom = totalWeight || 1;

    const rows = schools.map((s, idx) => {
      let composite = 0;
      for (const c of ACTIVE) {
        const w = Number(weights[c.key] || 0);
        const sc = norm[c.key][idx] ?? 50;
        composite += (w / denom) * sc;
      }
      return { ...s, composite: Number(composite.toFixed(2)) };
    });

    rows.sort((a, b) => (b.composite ?? 0) - (a.composite ?? 0));
    return rows.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [schools, weights, ACTIVE, totalWeight]);

  // 6. helpers
  function removeCriterion(key) {
    setCriteria((prev) => prev.filter((c) => c.key !== key));
    setWeights((w) => {
      const nw = { ...w };
      delete nw[key];
      return nw;
    });
  }
  function restoreDefaultCriteria() {
    setCriteria(CRITERIA_DEFAULT);
    setWeights({ ...defaultWeights });
  }
  function deleteSelected() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected school(s)?`)) return;
    setSchools((prev) => prev.filter((s) => !selectedIds.has(s.id)));
    setSelectedIds(new Set());
  }
  const allSelected =
    rowsWithScores.length > 0 &&
    rowsWithScores.every((r) => selectedIds.has(r.id));

  const chartData = rowsWithScores.map((r) => ({
    name: `#${r.rank} ${shorten(r.name, 24)}`,
    score: r.composite,
  }));

  function toggleCriterionKey(key) {
    setEnabledCriteriaKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    setWeights((w) => (w[key] == null ? { ...w, [key]: 10 } : w));
  }

  function removeEnabledCriterion(key) {
    setEnabledCriteriaKeys((prev) => prev.filter((k) => k !== key));
    setWeights((w) => {
      const { [key]: _drop, ...rest } = w;
      return rest;
    });
  }

  function updateField(sid, key, value) {
    setSchools((prev) =>
      prev.map((s) => (s.id === sid ? { ...s, [key]: value } : s))
    );
  }
  function addSchool() {
    setSchools((prev) => [
      ...prev,
      { id: makeId(), name: "New School", city: "", state: "", deadline: "" },
    ]);
  }

  
function addSchoolFromBank(key) {
  // search in all banks
  let template = null;
  for (const b of Object.values(SCHOOL_BANKS)) {
    const hit = b.list.find((s) => s.key === key);
    if (hit) { template = hit; break; }
  }
  if (!template) return;

  const nameExists = schools.some(
    (s) => s.name.trim().toLowerCase() === template.name.trim().toLowerCase()
  );
  const id = makeId();

  setSchools((prev) => [
    ...prev,
    {
      id,
      name: nameExists
        ? `${template.name} (${prev.filter((p) => p.name.startsWith(template.name)).length + 1})`
        : template.name,
      city: template.city || "",
      state: template.state || "",
      deadline: template.deadline || "",
    },
  ]);
}


  function toggleSelected(k) {
  setSelectedKeys(prev => {
    const s = new Set(prev);
    if (s.has(k)) s.delete(k);
    else s.add(k);
    return s;
  });
}

function addSelectedSchools(closeAfter = true) {
  if (selectedKeys.size === 0) return;
  [...selectedKeys].forEach(k => addSchoolFromBank(k));
  setSelectedKeys(new Set());
  if (closeAfter) setAddPickerOpen(false);
}

  function removeSchool(sid) {
    setSchools((prev) => prev.filter((s) => s.id !== sid));
  }

  function downloadFile(filename, text) {
    const a = document.createElement("a");
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(text);
    a.download = filename;
    a.click();
  }
  function exportJSON() {
    downloadFile(
      "dental-ranking-data.json",
      JSON.stringify({ schools, weights, criteria }, null, 2)
    );
  }
  function resetToDefaults() {
    if (!confirm("Reset to initial data?")) return;
    setSchools([]);
    setWeights({ ...defaultWeights });
    setCriteria(CRITERIA_DEFAULT);
  }
  function clearSaved() {
    localStorage.removeItem(STORAGE_KEY);
    alert("Saved copy cleared from this browser.");
  }
  function importJSON(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.schools) setSchools(parsed.schools);
        if (parsed.weights) setWeights(parsed.weights);
        if (parsed.criteria) setCriteria(parsed.criteria);
      } catch {
        alert("Could not parse file");
      }
    };
    reader.readAsText(file);
  }

  function addCriterionSubmit(e) {
    e?.preventDefault?.();
    setAddError("");
    const label = (newCrit.label || "").trim();
    if (!label) {
      setAddError("Label is required");
      return;
    }
    let key = newCrit.key.trim();
    if (!key) key = safeKey(label);
    key = safeKey(key);
    const reserved = new Set(["id", "name", "city", "state", "deadline"]);
    if (reserved.has(key)) {
      setAddError("That key is reserved. Try a different one.");
      return;
    }
    if (criteria.some((c) => c.key === key)) {
      setAddError("A criterion with that key already exists.");
      return;
    }
    const crit = {
      key,
      label,
      higherIsBetter: Boolean(newCrit.higherIsBetter),
      tip: newCrit.tip || "",
    };
    setCriteria((prev) => [...prev, crit]);
    setWeights((w) => ({ ...w, [key]: 0 }));
    setAddOpen(false);
    setNewCrit({ label: "", key: "", higherIsBetter: true, tip: "" });
  }

  const bgRainbow =
    "bg-[radial-gradient(1200px_600px_at_0%_0%,#fff0,rgba(255,0,122,0.12)),radial-gradient(900px_600px_at_100%_0%,#fff0,rgba(0,200,255,0.12)),radial-gradient(900px_600px_at_100%_100%,#fff0,rgba(0,255,150,0.12)),radial-gradient(900px_600px_at_0%_100%,#fff0,rgba(255,170,0,0.12))]";

  // 7. auth gate
if (!session && !guestMode) {
  return (
    <>
      <AlignMyNextLanding onGuest={continueAsGuest} onSignIn={onSignedIn} />
      {resetOpen && <ResetPasswordModal onClose={() => setResetOpen(false)} />}
    </>
  );
}


  // 8. MAIN RENDER (everything in one return)
  return (
    <div
      className={`min-h-screen p-4 md:p-8 space-y-6 ${
        rainbowMode
          ? bgRainbow
          : "bg-gradient-to-b from-rose-50 via-sky-50 to-violet-50"
      }`}
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-[conic-gradient(from_0deg_at_50%_50%,#ef4444,#f59e0b,#84cc16,#06b6d4,#8b5cf6,#ef4444)]">
              AlignMyNext
            </span>
            <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-fuchsia-500" />
          </h1>
          <p className="mt-1 text-sm md:text-base text-white/90 drop-shadow-[0_1px_1px_rgb(0_0_0_/_0.25)]">
            <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#f43f5e,#f59e0b,#22c55e,#06b6d4,#8b5cf6)]">
              Where Data Meets Destiny
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={signOutEverywhere}
            className="rounded-2xl px-3 py-2 border bg-white hover:bg-rose-50 text-sm font-semibold"
          >
            Log out
          </button>

          <button
  onClick={() => {
    setAddPickerOpen(true); // ✅ open modal
    setAddStep("bank");     // ✅ go to step 1 (bank chooser)
    setBankId(null);        // ✅ no bank selected yet
    setSelectedKeys(new Set()); // ✅ clear previous selections
    setSchoolSearch("");    // ✅ clear search bar
  }}
  className="rounded-2xl px-3 py-2 text-white bg-[linear-gradient(90deg,#ff80b5,#9089fc)] hover:opacity-90 flex items-center gap-2"
>
  <Plus className="w-4 h-4" />
  Add School
</button>


        
          <button
            onClick={deleteSelected}
            disabled={selectedIds.size === 0}
            className={`rounded-2xl px-3 py-2 border ${
              selectedIds.size === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-rose-50"
            }`}
          >
            Delete Selected
          </button>

          <button
            onClick={restoreDefaultCriteria}
            className="rounded-2xl px-3 py-2 border bg-white hover:bg-sky-50"
          >
            Restore Default Criteria
          </button>
        </div>
      </header>

      {/* Blank canvas banner */}
      {schools.length === 0 && criteria.length === 0 && (
        <div className="my-6 rounded-2xl border-2 border-dashed border-white/60 bg-white/70 backdrop-blur p-6 text-center space-y-3">
          <h2 className="text-xl font-semibold">Start Your Comparison</h2>
          <p className="text-slate-600">
            Add at least one school and one criterion to begin. You can
            customize everything.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={addSchool}
              className="rounded-xl px-3 py-2 bg-[linear-gradient(90deg,#ff80b5,#9089fc)] text-white hover:opacity-90"
            >
              + Add School
            </button>
            <button
              onClick={() => setAddOpen(true)}
              className="rounded-xl px-3 py-2 border bg-white hover:bg-slate-50"
            >
              + Add Criterion
            </button>
            <button
              onClick={restoreDefaultCriteria}
              className="rounded-xl px-3 py-2 border bg-white hover:bg-slate-50"
            >
              Load Starter Criteria
            </button>
          </div>
        </div>
      )}

     {addPickerOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-3xl w-[88%] max-w-[590px] p-5 md:p-6 shadow-2xl space-y-5 max-h-[86vh] overflow-hidden flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#f43f5e,#f59e0b,#22c55e,#06b6d4,#8b5cf6)]">
            {addStep === "bank"
              ? "Choose a School Bank"
              : `Pick a ${SCHOOL_BANKS[bankId]?.label} School`}
          </span>
        </h3>
        <button
          className="text-sm px-2 py-1 rounded-xl hover:bg-slate-100"
          onClick={() => setAddPickerOpen(false)}
        >
          Close
        </button>
      </div>

      {/* STEP 1: BANK CHOOSER */}
      {addStep === "bank" && (
        <>
          <div className="grid grid-cols-1 gap-3">
            {(["dental","med","law"]).map((id) => {
              const bank = SCHOOL_BANKS[id];
              return (
                <button
                  key={id}
                  onClick={() => { setBankId(id); setAddStep("pick"); }}
                  className={`rounded-2xl px-4 py-4 text-left border bg-white hover:bg-slate-50 transition
                              shadow-sm`}
                >
                  <div className={`inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold text-white bg-gradient-to-r ${bank.gradient}`}>
                    {bank.label} Schools
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {bank.list.length} schools available
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-2">
            <button
              className="rounded-2xl px-4 py-2 border"
              onClick={() => setAddPickerOpen(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* STEP 2: PICKER FOR THE CHOSEN BANK */}
      {addStep === "pick" && (
        <>
          {/* Search */}
          <input
            type="text"
            value={schoolSearch}
            onChange={(e) => setSchoolSearch(e.target.value)}
            placeholder={`Search ${SCHOOL_BANKS[bankId]?.label?.toLowerCase()} schools…`}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 outline-none focus:ring-2 focus:ring-pink-200"
          />

          {/* List */}
          <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white/60 p-2 space-y-2">
            {activeList
              .filter((s) => {
                const q = schoolSearch.trim().toLowerCase();
                if (!q) return true;
                return (
                  s.name.toLowerCase().includes(q) ||
                  (s.city || "").toLowerCase().includes(q) ||
                  (s.state || "").toLowerCase().includes(q)
                );
              })
              .map((s) => {
                const checked = selectedKeys.has(s.key);
                return (
                  <label
                    key={s.key}
                    className={`flex items-start gap-3 rounded-2xl border px-3 py-3 cursor-pointer transition
                    ${checked ? "border-fuchsia-300 bg-fuchsia-50/60" : "border-slate-200 hover:bg-slate-50"}`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4"
                      checked={checked}
                      onChange={() => {
                        setSelectedKeys(prev => {
                          const next = new Set(prev);
                          if (next.has(s.key)) next.delete(s.key);
                          else next.add(s.key);
                          return next;
                        });
                      }}
                    />
                    <div className="text-sm">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-slate-500">
                        {s.city}{s.city && s.state ? ", " : ""}{s.state}
                      </div>
                    </div>
                  </label>
                );
              })}
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <button
                className="px-2 py-1 rounded-xl border hover:bg-slate-50"
                onClick={() => setSelectedKeys(new Set())}
              >
                Clear
              </button>
              <button
                className="px-2 py-1 rounded-xl border hover:bg-slate-50"
                onClick={() => {
                  const visible = activeList.filter((s) => {
                    const q = schoolSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      s.name.toLowerCase().includes(q) ||
                      (s.city || "").toLowerCase().includes(q) ||
                      (s.state || "").toLowerCase().includes(q)
                    );
                  }).map((s) => s.key);
                  setSelectedKeys(new Set(visible));
                }}
              >
                Select all (filtered)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="rounded-2xl px-4 py-2 border"
                onClick={() => setAddStep("bank")}
              >
                Back
              </button>
              <button
                disabled={selectedKeys.size === 0}
                className="rounded-2xl px-4 py-2 text-white bg-[linear-gradient(90deg,#f97316,#ec4899,#6366f1)] disabled:opacity-50"
                onClick={() => {
                  // add all selected from chosen bank, then close
                  if (selectedKeys.size > 0) {
                    [...selectedKeys].forEach((k) => addSchoolFromBank(k));
                  }
                  setSelectedKeys(new Set());
                  setAddPickerOpen(false);
                }}
              >
                Add & Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}


      
      {/* main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* weights panel */}
        <div className="order-2 xl:order-1 xl:col-span-1 rounded-3xl shadow-sm border-2 border-rose-100 bg-white/90 backdrop-blur p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Weights ({totalWeight})</h2>
            <button
              onClick={() => setAddOpen(true)}
              className="text-sm rounded-xl px-3 py-1.5 border bg-white hover:bg-emerald-50 inline-flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Criterion
            </button>
          </div>
          <p className="text-sm text-slate-600">
            We normalize factors (min→max) before combining; lower-is-better
            factors are auto-inverted.
          </p>

          {/* Add criterion modal */}
          {addOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <form
                onSubmit={addCriterionSubmit}
                className="bg-white rounded-3xl w-full max-w-md p-4 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Add Criterion</h3>
                  <button
                    type="button"
                    className="text-sm px-2 py-1 rounded-xl hover:bg-slate-100"
                    onClick={() => {
                      setAddOpen(false);
                      setAddError("");
                    }}
                  >
                    Close
                  </button>
                </div>
                {addError && (
                  <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                    {addError}
                  </div>
                )}
                <div className="grid gap-2">
                  <label className="text-sm">
                    Label
                    <input
                      className="mt-1 w-full border rounded-xl px-2 py-1"
                      value={newCrit.label}
                      onChange={(e) =>
                        setNewCrit((n) => ({ ...n, label: e.target.value }))
                      }
                      placeholder="e.g., Clinic Hours"
                    />
                  </label>
                  <label className="text-sm">
                    Key (optional)
                    <input
                      className="mt-1 w-full border rounded-xl px-2 py-1 font-mono"
                      value={newCrit.key}
                      onChange={(e) =>
                        setNewCrit((n) => ({ ...n, key: e.target.value }))
                      }
                      placeholder="clinic_hours"
                    />
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newCrit.higherIsBetter}
                      onChange={(e) =>
                        setNewCrit((n) => ({
                          ...n,
                          higherIsBetter: e.target.checked,
                        }))
                      }
                    />
                    Higher is better
                  </label>
                  <label className="text-sm">
                    Help text (optional)
                    <input
                      className="mt-1 w-full border rounded-xl px-2 py-1"
                      value={newCrit.tip}
                      onChange={(e) =>
                        setNewCrit((n) => ({ ...n, tip: e.target.value }))
                      }
                      placeholder="How to score this (0–10, %, etc.)"
                    />
                  </label>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="rounded-xl px-3 py-2 border"
                    onClick={() => {
                      setAddOpen(false);
                      setAddError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl px-3 py-2 text-white bg-[linear-gradient(90deg,#34d399,#60a5fa)]"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {criteria.map((c, i) => (
              <div key={String(c.key)} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        background: rainbowMode
                          ? rainbowColor(i, criteria.length)
                          : pastelColors[i % pastelColors.length],
                      }}
                    />
                    {c.label}
                    <button
                      onClick={() => removeCriterion(c.key)}
                      className="ml-2 text-xs px-2 py-1 rounded-xl border hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                  <span className="text-sm text-slate-500" title={c.tip}>
                    {weights[c.key] ?? 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={Number(weights[c.key] || 0)}
                  onChange={(e) =>
                    setWeights((w) => ({
                      ...w,
                      [c.key]: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <div className="text-xs text-slate-500">
                  {c.higherIsBetter
                    ? "Higher is better"
                    : "Lower is better (auto-inverted)"}
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-500 pt-2">
            Tip: Total weight doesn’t need to equal 100 — we normalize internally.
          </div>
        </div>

        {/* table + editors */}
        <div className="order-1 xl:order-2 xl:col-span-2 rounded-3xl shadow-sm border-2 border-sky-100 bg-white/90 backdrop-blur p-6 space-y-4">
          <div className="inline-flex rounded-2xl border overflow-hidden">
            <button
              onClick={() => setActiveTab("data")}
              className={`px-3 py-2 text-sm ${
                activeTab === "data" ? "bg-fuchsia-100" : "bg-white"
              }`}
            >
              Data Table
            </button>
            <button
              onClick={() => setActiveTab("chart")}
              className={`px-3 py-2 text-sm flex items-center gap-1 ${
                activeTab === "chart" ? "bg-fuchsia-100" : "bg-white"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Chart
            </button>
          </div>

          {activeTab === "data" && (
            <div className="overflow-x-auto rounded-2xl border">
              <table className="w-full text-sm">
                <thead className="bg-pink-50/70">
  <tr>
    {/* select-all checkbox */}
    <th className="p-3 text-left w-[40px]">
      <input
        type="checkbox"
        checked={allSelected}
        onChange={() => {
          if (allSelected) {
            setSelectedIds(new Set());
          } else {
            setSelectedIds(new Set(rowsWithScores.map((r) => r.id)));
          }
        }}
      />
    </th>

    {/* NEW: delete column header */}
    <th className="p-3 text-left w-[50px]">Del</th>

    <th className="p-3 text-left">Rank</th>
    <th className="p-3 text-left">School</th>
    <th className="p-3 text-left">City</th>
    <th className="p-3 text-left">State</th>
    <th className="p-3 text-left">Deadline</th>

    {criteria.map((c) => (
      <th
        key={String(c.key)}
        className="p-3 text-left whitespace-nowrap"
        title={c.tip}
      >
        {c.label}
      </th>
    ))}

    <th className="p-3 text-left">Combined</th>
  </tr>
</thead>

                <tbody>
                 {rowsWithScores.map((row, i) => (
  <tr
    key={row.id}
    className="border-t transition-colors"
    style={{
      background: rainbowMode
        ? rainbowAlpha(i, rowsWithScores.length, 0.08)
        : undefined,
    }}
  >
    {/* 1. row checkbox */}
    <td className="p-3">
      <input
        type="checkbox"
        checked={selectedIds.has(row.id)}
        onChange={() => {
          setSelectedIds((prev) => {
            const s = new Set(prev);
            if (s.has(row.id)) s.delete(row.id);
            else s.add(row.id);
            return s;
          });
        }}
      />
    </td>

    {/* 2. NEW: delete button on the left */}
    <td className="p-3">
      <button
        onClick={() => removeSchool(row.id)}
        className="p-2 rounded-xl hover:bg-rose-100"
        title="Delete this school"
      >
        <Trash2 className="w-4 h-4 text-rose-500" />
      </button>
    </td>

    {/* 3. rank */}
    <td className="p-3 font-medium">
      <span className="inline-flex items-center gap-2">
        <span
          className="inline-block w-2 h-5 rounded-full"
          style={{
            background: rainbowMode
              ? rainbowColor(i, rowsWithScores.length)
              : pastelColors[i % pastelColors.length],
          }}
        />
        {row.rank}
      </span>
    </td>

    {/* 4. school + rest, same as before */}
    <td className="p-3 min-w-[260px]">
      <InlineEdit
        value={row.name}
        onChange={(v) => updateField(row.id, "name", v)}
      />
    </td>
    <td className="p-3">
      <InlineEdit
        value={row.city || ""}
        onChange={(v) => updateField(row.id, "city", v)}
      />
    </td>
    <td className="p-3 w-[80px]">
      <InlineEdit
        value={row.state || ""}
        onChange={(v) => updateField(row.id, "state", v)}
      />
    </td>
    <td className="p-3 w-[140px]">
      <InlineEdit
        value={row.deadline || ""}
        placeholder="YYYY-MM-DD"
        onChange={(v) => updateField(row.id, "deadline", v)}
      />
    </td>

    {/* criteria cells – keep exactly how you had them */}
    {criteria.map((c) => (
      <td key={String(c.key)} className="p-3 w-[120px]">
        <NumericCell
          value={row[c.key]}
          onChange={(v) => updateField(row.id, c.key, v)}
          placeholder={
            c.key === "looks"
              ? "rate the campus 0–10"
              : c.key === "cityLike"
              ? "0–10"
              : c.key === "curriculum"
              ? "flexibility 0–10"
              : c.key === "clinical"
              ? "exposure 0–10"
              : ""
          }
        />
      </td>
    ))}

    {/* combined score */}
    <td className="p-3 font-semibold">
      {(row.composite ?? 0).toFixed(1)}
    </td>
  </tr>
))}

                </tbody>
              </table>
            </div>
          )}

          {activeTab === "chart" && (
            <>
              {chartData.length > 0 ? (
                <div className="h-[460px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <XAxis
                        dataKey="name"
                        hide={true}
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(v, _k, p) => [
                          `${Number(v).toFixed(1)}`,
                          p && p.payload ? p.payload.rawName : "",
                        ]}
                        labelFormatter={() => ""}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                        {chartData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={
                              rainbowMode
                                ? rainbowColor(i, chartData.length)
                                : pastelColors[i % pastelColors.length]
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center text-slate-600 text-sm py-10 bg-white/60 rounded-xl shadow-sm">
                  Add schools and criteria to generate a chart.
                </div>
              )}
            </>
          )}

          {/* aesthetic rater */}
          <div>
            <button
              onClick={() => setRaterOpen(true)}
              className="rounded-2xl px-3 py-2 text-white bg-[linear-gradient(90deg,#ff80b5,#9089fc)] hover:opacity-90 inline-flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Open Rater
            </button>
            {raterOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="bg-white rounded-3xl w-full max-w-2xl p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">
                      Rate Aesthetics (0–10)
                    </h3>
                    <button
                      className="text-sm px-2 py-1 rounded-xl hover:bg-slate-100"
                      onClick={() => setRaterOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
                    {schools.map((s, i) => (
                      <div
                        key={s.id}
                        className="grid grid-cols-[1fr,120px] gap-3 items-center"
                      >
                        <div className="text-sm">
                          <span className="font-medium flex items-center gap-2">
                            <span
                              className="inline-block w-3 h-3 rounded-full"
                              style={{
                                background: rainbowColor(i, schools.length),
                              }}
                            />
                            {s.name}
                          </span>
                          <div className="text-slate-500">
                            {s.city}, {s.state}
                          </div>
                        </div>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          className="border rounded-xl px-2 py-1"
                          value={s.looks ?? ""}
                          onChange={(e) =>
                            updateField(
                              s.id,
                              "looks",
                              parseNumberOrNull(e.target.value)
                            )
                          }
                          placeholder="0–10"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      className="rounded-2xl px-3 py-2 border"
                      onClick={() => setRaterOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-3xl shadow-sm border-2 border-violet-100 bg-white/90 backdrop-blur p-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Quick Notes</h3>
          <ul className="text-sm text-slate-600 list-disc pl-5 space-y-2">
            <li>
              We normalize each factor with min→max scaling to 0–100 and
              auto-invert lower-is-better ones (Price, Grad Requirements).
            </li>
            <li>
              Composite score is a weighted average of those standardized scores.
            </li>
            <li>
              Leave a field blank if you don’t know it — we treat it neutrally (~50
              after scaling).
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Tips</h3>
          <ul className="text-sm text-slate-600 list-disc pl-5 space-y-2">
            <li>
              Use <strong>How Much I Like the City</strong> (0–10) for your personal
              preference.
            </li>
          </ul>
        </div>
      </div>

      <InternalChecks />
      
      {resetOpen && (
        <ResetPasswordModal onClose={() => setResetOpen(false)} />
      )}
    </div>
  );
}

/* -------------------- SMALL COMPONENTS -------------------- */

function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function sendReset(e) {
    e.preventDefault();
    setMsg("");
    if (!email) return setMsg("Please enter your email.");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`,
    });

    if (error) setMsg(error.message);
    else setMsg("Check your inbox for a reset link.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={sendReset}
        className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-xl"
      >
        <h3 className="text-lg font-semibold">Reset your password</h3>
        {msg && <div className="text-sm text-slate-700">{msg}</div>}

        <label className="block text-sm">
          Email
          <input
            type="email"
            className="mt-1 w-full border rounded-xl px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl px-3 py-2 text-white bg-[linear-gradient(90deg,#ff80b5,#9089fc)]"
        >
          Send reset link
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-sm text-slate-600 hover:underline"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}


function ResetPasswordModal({ onClose }) {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [msg, setMsg] = useState("");

  async function submitNewPassword(e) {
    e.preventDefault();
    setMsg("");

    if (p1.length < 6) return setMsg("Password must be at least 6 characters.");
    if (p1 !== p2) return setMsg("Passwords do not match.");

    const { error } = await supabase.auth.updateUser({ password: p1 });
    if (error) setMsg(error.message);
    else {
      setMsg("Password updated. You can close this window.");
      setTimeout(() => onClose(), 1200);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={submitNewPassword}
        className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-xl"
      >
        <h3 className="text-lg font-semibold">Set a new password</h3>
        {msg && <div className="text-sm text-slate-700">{msg}</div>}

        <label className="block text-sm">
          New password
          <input
            type="password"
            className="mt-1 w-full border rounded-xl px-3 py-2"
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            required
          />
        </label>

        <label className="block text-sm">
          Confirm new password
          <input
            type="password"
            className="mt-1 w-full border rounded-xl px-3 py-2"
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl px-3 py-2 text-white bg-[linear-gradient(90deg,#ff80b5,#9089fc)]"
        >
          Save password
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-sm text-slate-600 hover:underline"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

function InlineEdit({ value, onChange, placeholder }) {
  const [v, setV] = useState(value ?? "");
  useEffect(() => setV(value ?? ""), [value]);
  return (
    <input
      className="w-full bg-transparent outline-none border-b border-transparent focus:border-slate-300 transition-colors"
      value={v}
      onChange={(e) => {
        setV(e.target.value);
        if (onChange) onChange(e.target.value);
      }}
      placeholder={placeholder}
    />
  );
}

function NumericCell({ value, onChange, placeholder }) {
  const [v, setV] = useState(value == null ? "" : String(value));
  useEffect(() => setV(value == null ? "" : String(value)), [value]);
  return (
    <input
      className="w-full bg-white border rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-200"
      type="number"
      step="any"
      value={v}
      onChange={(e) => {
        setV(e.target.value);
        if (onChange) onChange(parseNumberOrNull(e.target.value));
      }}
      placeholder={placeholder}
    />
  );
}

function minMaxForTest(arr) {
  return minMax(arr);
}

function InternalChecks() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const out = [];

    const mm = minMaxForTest([0, 50, 100]);
    out.push(Math.abs(mm.scale(0) - 0) < 1e-6 ? "✅ minMax 0" : "❌ minMax 0");
    out.push(
      Math.abs(mm.scale(100) - 100) < 1e-6 ? "✅ minMax 100" : "❌ minMax 100"
    );

    try {
      const rows = [{ price: 100 }, { price: 200 }];
      const inv = normalizeCriterion(rows, "price", false);
      out.push(
        inv[0] > inv[1] ? "✅ lower price scores higher" : "❌ price invert"
      );
    } catch (e) {
      out.push("❌ price invert threw");
    }

    setLogs(out);
  }, []);
  return (
    <div className="rounded-3xl shadow-sm border-2 border-emerald-100 bg-white/90 backdrop-blur p-4">
      <h3 className="text-base font-semibold mb-2">Internal Checks</h3>
      <ul className="text-sm text-slate-700 grid gap-1">
        {logs.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
