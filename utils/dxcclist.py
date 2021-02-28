import requests
from bs4 import BeautifulSoup
arrl_url = "http://www.arrl.org/country-lists-prefixes"
dxcc_url = "https://www.arrl.org/files/file/DXCC/2020%20Current_Deleted.txt"
iban_url = "https://www.iban.com/country-codes"

def differAtIndex(a,b):
    for i in range(len(a)):
        if a[i]!=b[i]:
            return i
    return None

def IncrementAt(s, i):
    return s[:i] + chr(ord(s[i])+1) + s[i+1:]

# load iban codes
r = requests.get(iban_url)
iban_soup = BeautifulSoup(r.text, 'html.parser')
rows = iban_soup.find_all('tr')
iban_dict = {}
for row in rows[1:]:
    items = [x.string for x in row.find_all('td')]
    iban_dict[items[0].replace(" (the)","").replace(", United Republic of","").replace(", State of","")] = items[1:]

# adaptations
iban_dict["Spratly Islands"] = ['--','---','000']
iban_dict["Sovereign Military Order of Malta"] = ['--','---','000']
iban_dict["Agalega and Saint Brandon Islands"] = iban_dict['Mauritius']
iban_dict["Rodrigues Island"] = iban_dict['Mauritius']
iban_dict["Annobon Island"] = iban_dict['Equatorial Guinea']
iban_dict["Conway Reef"] = iban_dict['Fiji']
iban_dict["Rotuma Island"] = iban_dict['Fiji']
iban_dict["Kingdom of Eswatini"] = iban_dict['Eswatini']
iban_dict["Bouvet"] = iban_dict["Bouvet Island"]
iban_dict["Peter 1 Island"] = iban_dict['Norway']
iban_dict["ITU HQ"] = ['UN','---','000']
iban_dict["United Nations HQ"] = ['UN','---','000']
iban_dict["West Malaysia"] = iban_dict['Malaysia']
iban_dict["East Malaysia"] = iban_dict['Malaysia']
iban_dict["Democratic Republic of the Congo"] = iban_dict['Congo (the Democratic Republic of the)']
iban_dict["Scarborough Reef"] = iban_dict['China']
iban_dict["Taiwan"] = iban_dict['Taiwan (Province of China)']
iban_dict["Pratas Island"] = iban_dict['Taiwan (Province of China)']
iban_dict["The Gambia"] = iban_dict['Gambia']
iban_dict["Easter Island"] = iban_dict['Chile']
iban_dict["Juan Fernandez Islands"] = iban_dict['Chile']
iban_dict["San Felix and San Ambrosio"] = iban_dict['Chile']
iban_dict["Bolivia"] = iban_dict['Bolivia (Plurinational State of)']
iban_dict["Madeira Islands"] = iban_dict['Portugal']
iban_dict["Azores"] = iban_dict['Portugal']
iban_dict["Sable Island"] = iban_dict['Canada']
iban_dict["Saint Paul Island"] = iban_dict['United States of America']
iban_dict["Cape Verde"] = iban_dict['Portugal']
iban_dict["Federal Republic of Germany"] = iban_dict['Germany']
iban_dict["North Cook Islands"] = iban_dict['New Zealand']
iban_dict["South Cook Islands"] = iban_dict['New Zealand']
iban_dict["Bosnia-Herzegovina"] = iban_dict['Bosnia and Herzegovina']
iban_dict["Balearic Islands"] = iban_dict['Spain']
iban_dict["Canary Islands"] = iban_dict['Spain']
iban_dict["Ceuta and Melilla"] = iban_dict['Spain']
iban_dict["Iran"] = iban_dict['Iran (Islamic Republic of)']
iban_dict["Moldova"] = iban_dict['Moldova (the Republic of)']
iban_dict["Saint Barthelemy"] = iban_dict['France']
iban_dict["Chesterfield Islands"] = iban_dict['France']
iban_dict["Austral Island"] = iban_dict['France']
iban_dict["Clipperton Island"] = iban_dict['France']
iban_dict["Marquesas Islands"] = iban_dict['France']
iban_dict["Saint Pierre and Miquelon"] = iban_dict['France']
iban_dict["Reunion Island"] = iban_dict['France']
iban_dict["Glorioso Islands"] = iban_dict['France']
iban_dict["Juan de Nova, Europa"] = iban_dict['France']
iban_dict["Saint Martin"] = iban_dict['France']
iban_dict["Crozet Island"] = iban_dict['France']
iban_dict["Kerguelen Islands"] = iban_dict['France']
iban_dict["Amsterdam and Saint Paul Islands"] = iban_dict['France']
iban_dict["Wallis and Futuna Islands"] = iban_dict['France']
iban_dict["England"] = iban_dict['United Kingdom of Great Britain and Northern Ireland']
iban_dict["Northern Ireland"] = iban_dict['United Kingdom of Great Britain and Northern Ireland']
iban_dict["Scotland"] = iban_dict['United Kingdom of Great Britain and Northern Ireland']
iban_dict["Wales"] = iban_dict['United Kingdom of Great Britain and Northern Ireland']
iban_dict["Solomon Islands"] = iban_dict['Solomon Islands']
iban_dict["Temotu Province"] = iban_dict['Solomon Islands']
iban_dict["Galapagos Islands"] = iban_dict['Ecuador']
iban_dict["Malpelo Island"] = iban_dict['Colombia']
iban_dict["San Andres and Providencia"] = iban_dict['Colombia']
iban_dict["Republic of Korea"] = iban_dict['Korea (the Republic of)']
iban_dict["Vatican"] = ['VA','---','000']
iban_dict["Sardinia"] = iban_dict['Italy']
iban_dict["Saint Vincent"] = iban_dict['Saint Vincent and the Grenadines']
iban_dict["Minami Torishima"] = iban_dict['Japan']
iban_dict["Ogasawara"] = iban_dict['Japan']
iban_dict["Svalbard"] = iban_dict['Norway']
iban_dict["Jan Mayen"] = iban_dict['Norway']
iban_dict["Guantanamo Bay"] = iban_dict['United States of America']
iban_dict["Mariana Islands"] = iban_dict['United States of America']
iban_dict["Baker and Howland Islands"] = iban_dict['United States of America']
iban_dict["Johnston Island"] = iban_dict['United States of America']
iban_dict["Midway Island"] = iban_dict['United States of America']
iban_dict["Palmyra and Jarvis Islands"] = iban_dict['United States of America']
iban_dict["Hawaii"] = iban_dict['United States of America']
iban_dict["Kure Island"] = iban_dict['United States of America']
iban_dict["Swains Island"] = iban_dict['United States of America']
iban_dict["Wake Island"] = iban_dict['United States of America']
iban_dict["Alaska"] = iban_dict['United States of America']
iban_dict["Navassa Island"] = iban_dict['United States of America']
iban_dict["Virgin Islands"] = iban_dict['United States of America']
iban_dict["Desecheo Island"] = iban_dict['Puerto Rico']
iban_dict["Aland Islands"] = iban_dict['Finland']
iban_dict["Market Reef"] = iban_dict['Sweden']
iban_dict["Czech Republic"] = iban_dict['Czechia']
iban_dict["Slovak Republic"] = iban_dict['Slovakia']
iban_dict["Faroe Islands"] = iban_dict['Faroe Islands']
iban_dict["Democratic People's Rep. of Korea"] = iban_dict["Korea (the Democratic People's Republic of)"]
iban_dict["Curacao"] = ["CW","CUW", 531]
iban_dict["Bonaire"] = iban_dict['Bonaire, Sint Eustatius and Saba']
iban_dict["Saba and Saint Eustatius"] = iban_dict['Bonaire, Sint Eustatius and Saba']
iban_dict["Sint Maarten"] = iban_dict['Sint Maarten (Dutch part)']
iban_dict["Fernando de Noronha"] = iban_dict['Brazil']
iban_dict["Saint Peter and Saint Paul Rocks"] = iban_dict['Brazil']
iban_dict["Trindade and Martim Vaz Islands"] = iban_dict['Brazil']
iban_dict["Franz Josef Land"] = iban_dict['Russian Federation']
iban_dict["Mount Athos"] = iban_dict['Greece']
iban_dict["Dodecanese"] = iban_dict['Greece']
iban_dict["Crete"] = iban_dict['Greece']
iban_dict["W. Kiribati (Gilbert Islands )"] = iban_dict['Kiribati']
iban_dict["C. Kiribati (British Phoenix Islands)"] = iban_dict['Kiribati']
iban_dict["E. Kiribati (Line Islands)"] = iban_dict['Kiribati']
iban_dict["Banaba Island (Ocean Island)"] = iban_dict['Kiribati']
iban_dict["Cocos Island"] = iban_dict['Costa Rica']
iban_dict["Corsica"] = iban_dict['France']
iban_dict["Central Africa"] = iban_dict['Central African Republic']
iban_dict["Republic of the Congo"] = iban_dict['Congo']
iban_dict["Cote d'Ivoire"] = iban_dict["Côte d'Ivoire"]
iban_dict["European Russia"] = iban_dict['Russian Federation']
iban_dict["Kaliningrad"] = iban_dict['Russian Federation']
iban_dict["Asiatic Russia"] = iban_dict['Russian Federation']
iban_dict["Micronesia"] = iban_dict['Micronesia (Federated States of)']
iban_dict["Heard Island"] = iban_dict['Heard Island and McDonald Islands']
iban_dict["Macquarie Island"] = iban_dict['New Zealand']
iban_dict["Lord Howe Island"] = iban_dict['Australia']
iban_dict["Mellish Reef"] = iban_dict['Australia']
iban_dict["Willis Island"] = iban_dict['Australia']
iban_dict["British Virgin Islands"] = iban_dict['Virgin Islands (British)']
iban_dict["Pitcairn Island"] = iban_dict['Pitcairn']
iban_dict["Ducie Island"] = iban_dict['Pitcairn']
iban_dict["Falkland Islands"] = iban_dict['Falkland Islands [Malvinas]']
iban_dict["South Georgia Island"] = iban_dict['South Georgia and the South Sandwich Islands']
iban_dict["South Orkney Islands"] = iban_dict['United Kingdom of Great Britain and Northern Ireland']
iban_dict["South Sandwich Islands"] = iban_dict['South Georgia and the South Sandwich Islands']
iban_dict["South Shetland Islands"] = iban_dict['United Kingdom of Great Britain and Northern Ireland']
iban_dict["Chagos Islands"] = iban_dict['United Kingdom of Great Britain and Northern Ireland']
iban_dict["Andaman and Nicobar Islands"] = iban_dict['India']
iban_dict["Lakshadweep Islands"] = iban_dict['India']
iban_dict["Revillagigedo"] = iban_dict['Mexico']
iban_dict["Laos"] = iban_dict["Lao People's Democratic Republic"]
iban_dict["Syria"] = iban_dict['Syrian Arab Republic']
iban_dict["Venezuela"] = iban_dict['Venezuela (Bolivarian Republic of)']
iban_dict["Aves Island"] = iban_dict['Venezuela']
iban_dict["North Macedonia (Republic of)"] = iban_dict["Republic of North Macedonia"]
iban_dict["Republic of Kosovo"] = ['XK','---','000']
iban_dict["South Sudan (Republic of)"] = iban_dict["South Sudan"]
iban_dict["UK Sovereign Base Areas on Cyprus"] = iban_dict['United Kingdom of Great Britain and Northern Ireland']
iban_dict["Saint Helena"] = iban_dict['Saint Helena, Ascension and Tristan da Cunha']
iban_dict["Ascension Island"] = iban_dict['Saint Helena, Ascension and Tristan da Cunha']
iban_dict["Tristan da Cunha and Gough Island"] = iban_dict['Saint Helena, Ascension and Tristan da Cunha']
iban_dict["Tokelau Islands"] = iban_dict['Tokelau']
iban_dict["Chatham Islands"] = iban_dict["New Zealand"]
iban_dict["Kermadec Islands"] = iban_dict["New Zealand"]
iban_dict["New Zealand Subantarctic Islands"] = iban_dict["New Zealand"]
iban_dict["Prince Edward and Marion Islands"] = iban_dict["South Africa"]
iban_dict['Tromelin Island'] = iban_dict['France']

# dxcc list
list = {}

r = requests.get(dxcc_url)
lines = r.text.split('\n')
index = 0

#skip header
while '_' not in lines[index]:
    index+=1
index+=1
    
# scan lines
while lines[index].strip() != '':
    tokens = lines[index].split()
    prefix = tokens[0].replace("*", "").replace("#", "").strip()
    entity_code = tokens[-1]
    cq_zone = tokens[-2]
    itu_zone = tokens[-3]
    continent = tokens[-4]
    name = ' '.join(tokens[1:-4])
    abbr_name= name.replace("Asiatic","As.").replace("European","Eu.").replace("Federal Republic of ","F.R.").replace("United States of America","USA").replace("Republic","Rep.")
    iban_name = name.replace("&","and").replace("Is.","Islands").replace("I.","Island").replace("St.","Saint")
    flag = iban_dict[iban_name][0] if iban_name in iban_dict else ""
    if flag=="":
        print('no iban for', iban_name)
    entity = { 'name':abbr_name, 'continent':continent, 'cq_zone':cq_zone, 'itu_zone':itu_zone, 'entity_code':entity_code, 'flag':flag}
    if prefix.endswith(')'):
        prefix = prefix[:prefix.index('(')].strip()
    prefixes = prefix.split(',')
    for i,p in enumerate(prefixes):
        count = len(p.split('-')) - 1
        if count == 2:
            # UA-UI1-7
            # UA-UI8-0
            fromto = p.split('-')
            from1 = fromto[0]
            to1 = fromto[1][:len(from1)]
            from2 = fromto[1][len(from1):]
            to2=fromto[2].replace('0',':')
            header = from1[:-1]
            for a in range(ord(from1[-1]), ord(to1[-1])+1):
                for b in range(ord(from2[-1]), ord(to2[-1])+1):
                    pass
                    list[header+chr(a)+chr(b).replace(":","0")] = entity
           
        elif count == 1:
          suffix = ""
          fromto = p.split('-')
          if len(fromto[0]) > len(fromto[1]):
              # H6-7
              fromto[1] = fromto[0][:len(fromto[0]) - len(fromto[1])] + fromto[1]
          if len(fromto[1]) > len(fromto[0]) :
              # PP0-PY0F
              suffix = fromto[1][len(fromto[0]):]
              fromto[1] = fromto[1][:len(fromto[0])]
          loc = differAtIndex(fromto[0],fromto[1])
          fromto[1] = IncrementAt(fromto[1], loc)
          while fromto[0] != fromto[1]:
              list[fromto[0]+suffix] = entity
              fromto[0] = IncrementAt(fromto[0], loc)

        elif p.isnumeric():
            # PJ5,6           Saba & St. Eustatius  
            # 9M2,4           West Malaysia
            base = prefixes[i-1]
            list[base[:len(base)-len(p)] +p ] = entity

        else:
            if p!='':
              list[p] = entity
    index+=1

# undocumented
list["R"] = { 'name':"Russia", 'continent':'AS', 'cq_zone':0, 'itu_zone':0, 'entity_code':0, 'flag':'RU'}
list["HF"] = { 'name':"Poland", 'continent':'EU', 'cq_zone':0, 'itu_zone':0, 'entity_code':0, 'flag':'PL'}
list["AU"] = { 'name':"India", 'continent':'AS', 'cq_zone':0, 'itu_zone':0, 'entity_code':0, 'flag':'IN'}
list['TM'] = { 'name':"France", 'continent':'EU', 'cq_zone':0, 'itu_zone':0, 'entity_code':0, 'flag':'FR'}
list["1B"] = { 'name':"N. Cyprus", 'continent':'AS', 'cq_zone':0, 'itu_zone':0, 'entity_code':0, 'flag':''}
list["1S"] = { 'name':"Spratly Is", 'continent':'AS', 'cq_zone':0, 'itu_zone':0, 'entity_code':0, 'flag':'PG'}
list["2E"] = { 'name':"England (Novices)", 'continent':'EU', 'cq_zone':0, 'itu_zone':0, 'entity_code':0, 'flag':'GB'}
list["2I"] = { 'name':"Northern Ireland (Novices)", 'continent':'EU', 'cq_zone':0, 'itu_zone':0, 'entity_code':0, 'flag':'GB'}
list["2J"] = { 'name':"Jersey (Novices)", 'continent':'EU', 'cq_zone':0, 'itu_zone':0, 'entity_code':0, 'flag':'GB'}
list["2M"] = { 'name':"Scotland (Novices)", 'continent':'EU', 'cq_zone':0, 'itu_zone':0, 'entity_code':0, 'flag':'GB'}
list["2U"] = { 'name':"Guernsey & Dependencies (Novices)", 'continent':'EU', 'cq_zone':0, 'itu_zone':0, 'entity_code':0, 'flag':'GB'}
list["2W"] = { 'name':"Wales (Novices)", 'continent':'EU', 'cq_zone':0, 'itu_zone':0, 'entity_code':0, 'flag':'GB'}

# export
with open("dxcclist.csv",'w') as fout:
    for p in list:
        vals = [str(list[p][i]) for i in list[p].keys()]
        fout.write(', '.join([p]+vals) + '\n')
    