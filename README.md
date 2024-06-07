# ZOW-Tabelle für Abfälle nach den Vorgaben der Deponieverordnung - DepV ♻️

Auf Deponien werden Abfälle durch Ablagerung beseitigt. Oberirdische Deponien gliedern sich in die Klassen DK0 bis DKIII. Die für die Deponieklassen festgelegten Schadstoffgrenzwerte sind in Anhang 3 Tabelle 2 der [Deponieverordnung (DepV)](https://www.gesetze-im-internet.de/depv_2009/anhang_3.html) geregelt.

Abfälle müssen vor einer Deponierung grundsätzlich eine Deklarationsanalyse durchlaufen. Die Auswertung und Interpretation der Analyseergebnisse ist teils unübersichtlich und mühsam. Aus diesem Grund wurde die hier vorliegende ZOW-Tabelle entwickelt. Das Programm ermittelt bequem und schnell die jeweilige Güteklasse. Hierbei werden auch technisch gängige Interpretationshilfen berücksichtigt. 

Für bestimmte Schadstoffe, wie BTEX, PCB, MKW C10-40, und PAK16 sind in Anhang 3 Tabelle 2 DepV keine Grenzwerte festgelegt. Das Programm greift hier auf die in Baden-Württemberg gültige [Handlungshilfe für Entscheidungen über die Ablagerbarkeit von Abfällen mit organischen Schadstoffen](https://um.baden-wuerttemberg.de/fileadmin/redaktion/m-um/intern/Dateien/Dokumente/2_Presse_und_Service/Service/Rechtsvorschriften/Arbeitshilfen/Abfall/Handlungshilfe_organische_Schadstoffe_auf_Deponien.pdf) des Umweltministeriums zurück. 

## 1. Installation & Setup

Das Programm kann für Windows Anwendungen als .exe hier heruntergeladen werden: [Download](https://github.com/Fladimir97/ZOW-Tabelle-DepV/releases/download/1.0.0/zow-depv-1.0.0.Setup.exe)  
Den vollen Release der aktuellen Version 1.0.0 finden Sie [hier](https://github.com/Fladimir97/ZOW-Tabelle-DepV/releases/tag/1.0.0)

Das Programm wurde mit Hilfe von [Electron](https://www.electronjs.org/) kompiliert.
Bei der grafischen Auswertung wurde auf die [Plotly Graphing Library](https://plotly.com/javascript/) zurückgegriffen.

## 2. Wie funktioniert die Tabelle?

In die Tabelle werden die Messwerte und Stammdaten des jeweiligen Haufwerks eingegeben. Die Tabelle errechnet, ob bei dem jeweiligen Parameter Schadstoffüberschreitungen vorliegen, und gibt eine Einstufung ab. Die Messwerte werden hierbei automatisch gerundet. Außerdem wird ein Detailbericht angefertigt. 

In der ersten Spalte der Tabelle ist für jeden Parameter eine Checkbox hinterlegt. Sobald diese Checkbox aktiviert ist, werden die entsprechenden Messwerte tabellarisch im Detailbericht aufgeführt. Die Messwerte sind hierbei aufsteigend sortiert. Zudem werden die Werte  Mittelwert (X̅) sowie X̅ + Streuung aufgelistet. Diese sind wichtig für die Interpretation der Messergebnisse. Weitere Informationen dazu unter Ziff. 4 Technische Hinweise.

Weitere Funktionen der Tabelle:

- 💾 Speichern und Laden
- 📊 Grafische Auswertung der Messergebnisse
- 🖨️ Drucken / Generierung einer PDF der Tabelle und des Detailberichts
- 🧪 Ermittelt die erforderliche Probenzahl nach den Vorgaben der [LAGA PN98](https://www.laga-online.de/documents/m-32_pn98_red-aend_2019_mai_1562758999.pdf) bzw. der DIN 19698-6
- 📈 Ermittelt in Abhängigkeit der einstufungsrelevanten Zuordnungswerte, ob Schadstoff inhomogen verteilt sind

## 3. Technische Hinweise

Die vorliegende ZOW-Tabelle wendet auch gängige Interpretationsmuster wie die Rundungsregel, die 4 von 5 Regel und den statistischen Ansatz der Methosa an. 

### 3.1 Runden

Die Messwerte werden gerundet. Bei der Rundung wird analog auf die Vorgaben der Ziff. 2.9 der TA-Luft zurückgegriffen. Einstufungsrelevant ist demnach die Nachkommastelle, in der der jeweilige Grenzwert definiert wird.

Beispiel: Der BM-0 Grenzwert liegt bei PAK₁₆ bei 3 mg/kg. eine Nachkommastelle ist im Gesetzestext nicht definiert. Daher wird bei PAK₁₆ auf die volle Zahl gerundet. 

▶️ Messwert 1: 3,45 mg/kg wird abgerundet auf 3 mg/kg.  
▶️ Messwert 2: 3,52 mg/kg wird aufgerundet auf 4 mg/kg.

### 3.2 Die 4 von 5 Regel und der statistische Ansatz

Die Probenahme bei Erdaushub hat gem. [§ 14 Abs. 1 S. 2](https://www.gesetze-im-internet.de/ersatzbaustoffv/__14.html) i.V.m. [§ 8 Abs. 1 EBV](https://www.gesetze-im-internet.de/ersatzbaustoffv/__8.html) grundsätzlich nach den Vorgaben der [LAGA PN98](https://www.laga-online.de/documents/m-32_pn98_red-aend_2019_mai_1562758999.pdf) zu erfolgen. Dieses Regelwerk beschreibt wir Haufwerke beprobt werden. 

Die [Handlungshilfe zur Anwendung der LAGA PN98](https://www.laga-online.de/documents/hinweise_pn98_stand_2019_mai_1564665128.pdf) umfasst auch Informationen zur Bewertung der Messergebnisse:  

*"Für die Beurteilung streuender Analysenergebnisse ist in der [Methodensammlung Feststoffuntersuchung](https://www.umweltbundesamt.de/sites/default/files/medien/359/dokumente/20210615_methodensammlungfeststoffuntersuchung_v2_final_0.pdf) (Methosa) eine Beurteilungsgrundlage hinterlegt, anhand derer man entscheiden kann, ob die Ergebnisse eine vorgegebene Grenze einhalten."*  
(vgl. Handlungshilfe zur Anwendung der LAGA Mitteilung 32 (LAGA PN 98) Stand: 5. Mai 2019 Seite 15)

In der Methosa ist folgendes geregelt: Ein Grenzwert gilt als eingehalten, wenn die obigen Voraussetzungen und mindestens eine der nachfolgenden Bedingungen erfüllt sind:  
- alle Messwerte der Laborproben unterschreiten den Grenzwert oder
- der Mittelwert (x̄) und 80 % (4 von 5-Regel) aller Laborproben (LP) unterschreiten den Grenzwert oder
- der Mittelwert (x̄) zuzüglich der ermittelten Streuung des Mittelwerts unterschreitet den Grenzwert (statistischer Ansatz)

Die Werte errechnen sich folgendermaßen:

#### Begriffsbestimmungen:

| Abkürzung         | Erklärung                       |
|-------------------|---------------------------------|
|$LP$               | Laborprobe                      | 
|$LPi$              | Messwert der Laborprobe $i$     | 
|$SLP$              | Standardabweichung              | 
|$n$                | Anzahl der Laborproben          | 
|$x̄$                | Mittelwert der Messwerte        | 

#### Bestimmung des Mittelwerts:
```math
x̄  (Mittelwert) = \frac{1}{n} {\sum_{i=0}^n {LPi}}  
```
#### Bestimmung der Standardabweichung:
```math
Standardabweichung (SLP) =  \sqrt{\frac{1}{n-1} {\sum_{i=0}^n (LPi -x̄)^2}}
```
#### Bestimmung der Streuung:
```math
Streuung  = 1,65 \cdot  \frac{SLP}{\sqrt{n}}
```
Das Programm ermittelt zur vereinfachten Analysebewertung automatisch für die gewünschten Parameter den Mittelwert und die Streuung.
