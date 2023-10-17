import os
import csv
import json
cwd = os.getcwd()

cities_csv  = "uscities.csv"
cities_json = "uscities.json"
def format_cities():


            
    with open(cities_json, 'w') as json_f:
        csv_f =  open(cities_csv, 'r') 
        columns= ("city","city_ascii","state_id","state_name","county_fips","county_name","lat","lng","population","density","source","military","incorporated","timezone","ranking","zips","id")
        reader = csv.DictReader(csv_f, columns)

        json_rows = []
        for i, row in enumerate(reader):
            if i == 0:
                continue
            str_zips = row['zips'].split(" ")
            int_zips = None;
            if str_zips[0] == '':
                int_zips = []
            else:
                int_zips = [int(z) for z in str_zips]
            city_data = {
                "name": row['city'],
                "latitude": float(row['lat']),
                "longitude": float(row['lng']),
                "state": row['state_name'],
                "population":int(row["population"]),
                "zips":int_zips
            }

            
            json_rows.append(json.dumps(city_data))
        
        json_content = "[\n" + ",\n".join(json_rows) + "\n]"
        json_f.write(json_content)
        csv_f.close()



format_cities()