-- +goose Up

INSERT INTO medications (name, brand_name, drug_class, description) VALUES
  ('Tacrolimus',             'Prograf',             'Calcineurin Inhibitor',          'Primary immunosuppressant for most solid organ transplants; narrow therapeutic index; metabolized by CYP3A4 and P-glycoprotein'),
  ('Cyclosporine',           'Neoral / Sandimmune', 'Calcineurin Inhibitor',          'Older calcineurin inhibitor; also metabolized by CYP3A4; many drug and food interactions'),
  ('Mycophenolate Mofetil',  'CellCept',            'Antimetabolite',                 'Blocks purine synthesis in lymphocytes; usually paired with a calcineurin inhibitor'),
  ('Mycophenolic Acid',      'Myfortic',            'Antimetabolite',                 'Enteric-coated form of mycophenolate; equivalent mechanism to CellCept'),
  ('Azathioprine',           'Imuran',              'Antimetabolite',                 'Older antimetabolite; avoid allopurinol co-administration due to myelosuppression risk'),
  ('Prednisone',             'Deltasone',           'Corticosteroid',                 'Oral corticosteroid; contributes to post-transplant diabetes, hypertension, and bone loss'),
  ('Methylprednisolone',     'Medrol',              'Corticosteroid',                 'IV/oral corticosteroid used for induction and acute rejection episodes'),
  ('Sirolimus',              'Rapamune',            'mTOR Inhibitor',                 'mTOR inhibitor used in calcineurin-sparing regimens; metabolized by CYP3A4'),
  ('Everolimus',             'Zortress',            'mTOR Inhibitor',                 'mTOR inhibitor similar to sirolimus; metabolized by CYP3A4'),
  ('Belatacept',             'Nulojix',             'Biologic / Co-stimulation Blocker', 'Blocks T-cell co-stimulation; used in kidney transplant; administered IV monthly');

INSERT INTO dietary_restrictions (name, description) VALUES
  ('Low Potassium',                 'Limit potassium intake to under 2,000 mg/day; hyperkalemia is dangerous for kidney transplant recipients and those on calcineurin inhibitors'),
  ('Low Sodium',                    'Limit sodium intake to under 2,000 mg/day; important for managing post-transplant hypertension'),
  ('Low Phosphorus',                'Limit high-phosphorus foods; chronic kidney disease after transplant can impair phosphorus excretion'),
  ('Immunocompromised Food Safety', 'Avoid raw or undercooked animal products and unpasteurized foods; immunosuppression dramatically raises risk from foodborne pathogens'),
  ('Heart-Healthy / Low Fat',       'Limit saturated fat, trans fat, and dietary cholesterol; important for heart transplant recipients and prevention of cardiac allograft vasculopathy'),
  ('Diabetic / Low Glycemic',       'Limit high-sugar and refined carbohydrate foods; post-transplant diabetes mellitus is common, especially with calcineurin inhibitors and corticosteroids');

INSERT INTO foods (name, category, notes) VALUES
  -- Grapefruit family (CYP3A4 inhibitors via furanocoumarins)
  ('Grapefruit',              'fruit',      'Contains furanocoumarins that irreversibly inhibit intestinal CYP3A4'),
  ('Pomelo',                  'fruit',      'Contains furanocoumarins similar to grapefruit; carries the same drug interaction risk'),
  ('Seville Orange',          'fruit',      'Bitter orange used in marmalades; contains furanocoumarins unlike regular eating oranges'),
  ('Tangelo',                 'fruit',      'Grapefruit-tangerine hybrid; contains furanocoumarins at lower levels than pure grapefruit'),
  ('Blood Orange',            'fruit',      'Contains low levels of furanocoumarins; risk much lower than grapefruit but worth noting'),
  -- Safe fruits
  ('Apple',                   'fruit',      NULL),
  ('Banana',                  'fruit',      'High potassium (~422 mg per medium banana)'),
  ('Navel Orange',            'fruit',      'Regular eating orange; no furanocoumarin content; safe for transplant patients'),
  ('Strawberry',              'fruit',      NULL),
  ('Blueberry',               'fruit',      NULL),
  ('Mango',                   'fruit',      NULL),
  ('Watermelon',              'fruit',      NULL),
  ('Pineapple',               'fruit',      NULL),
  ('Avocado',                 'fruit',      'Very high potassium (~708 mg per medium avocado)'),
  ('Dried Apricot',           'fruit',      'Concentrated potassium per serving due to water removal'),
  ('Prune',                   'fruit',      'High potassium; also high fiber'),
  -- Vegetables
  ('Spinach (cooked)',        'vegetable',  'Moderate potassium; cooking and draining water reduces potassium content'),
  ('Broccoli (cooked)',       'vegetable',  NULL),
  ('Potato',                  'vegetable',  'High potassium (~925 mg per large baked potato with skin); boiling and discarding water reduces it ~50%'),
  ('Sweet Potato',            'vegetable',  'High potassium (~694 mg per medium)'),
  ('Tomato',                  'vegetable',  'Moderate potassium; tomato paste and sauce are highly concentrated'),
  ('Carrot',                  'vegetable',  NULL),
  ('Green Beans',             'vegetable',  NULL),
  ('Cucumber',                'vegetable',  NULL),
  ('Romaine Lettuce',         'vegetable',  NULL),
  ('Raw Sprouts',             'vegetable',  'High Salmonella and E. coli risk; FDA advises immunocompromised people to avoid entirely'),
  -- Proteins
  ('Cooked Chicken Breast',   'protein',    NULL),
  ('Cooked Salmon',           'protein',    'Omega-3 rich; heart-healthy choice for transplant recipients'),
  ('Cooked Whole Eggs',       'protein',    NULL),
  ('Canned Tuna',             'protein',    'Safe protein source; choose low-sodium varieties'),
  ('Raw Oysters',             'protein',    'High Vibrio vulnificus risk; frequently fatal in immunocompromised individuals'),
  ('Raw Sushi / Sashimi',     'protein',    'Risk of Listeria, Salmonella, and Anisakis (parasites) from raw fish'),
  ('Deli Meat / Cold Cuts',   'protein',    'Listeria risk even when refrigerated; safe only if reheated to 165°F immediately before eating'),
  ('Rare / Undercooked Beef', 'protein',    'E. coli O157:H7 risk; always cook beef to a safe internal temperature'),
  -- Dairy
  ('Pasteurized Milk',        'dairy',      NULL),
  ('Low-Fat Greek Yogurt',    'dairy',      'Pasteurized; good protein and calcium source'),
  ('Brie (unpasteurized)',    'dairy',      'Soft cheese from unpasteurized milk; Listeria monocytogenes risk'),
  ('Blue Cheese',             'dairy',      'Often made from unpasteurized milk; Listeria risk'),
  ('Processed Cheese Slices', 'dairy',      'Pasteurized but high sodium'),
  -- Grains
  ('White Rice',              'grain',      NULL),
  ('Pasta',                   'grain',      NULL),
  ('Whole Grain Bread',       'grain',      NULL),
  ('Oatmeal',                 'grain',      NULL),
  -- Legumes
  ('Kidney Beans',            'legume',     'High potassium and phosphorus; portion control important'),
  ('Black Beans',             'legume',     'High potassium; portion control important'),
  -- Beverages
  ('Coffee',                  'beverage',   NULL),
  ('Green Tea',               'beverage',   NULL),
  ('Orange Juice',            'beverage',   NULL),
  -- Supplements / herbs (patients frequently ask about these)
  ('St. John''s Wort',        'supplement', 'Potent CYP3A4 and P-gp inducer; dramatically lowers tacrolimus and cyclosporine blood levels'),
  ('Echinacea',               'supplement', 'Immunostimulant herb; may counteract immunosuppression'),
  ('Ginseng',                 'supplement', 'May affect immunosuppressant metabolism; evidence limited but caution warranted');

INSERT INTO food_interactions
  (food_id, trigger_type, medication_id, restriction_id, verdict, severity, reason, source)
VALUES
  -- Grapefruit family × calcineurin inhibitors and mTOR inhibitors
  (
    (SELECT id FROM foods       WHERE name = 'Grapefruit'),
    'medication',
    (SELECT id FROM medications WHERE name = 'Tacrolimus'),
    NULL,
    'avoid', 'high',
    'Grapefruit irreversibly inhibits intestinal CYP3A4, the primary enzyme metabolizing tacrolimus. Even a single serving can raise tacrolimus blood levels 2–3×, risking nephrotoxicity, neurotoxicity, and opportunistic infection from over-immunosuppression.',
    'FDA prescribing information (Prograf); KDIGO Transplant Guidelines'
  ),
  (
    (SELECT id FROM foods       WHERE name = 'Grapefruit'),
    'medication',
    (SELECT id FROM medications WHERE name = 'Cyclosporine'),
    NULL,
    'avoid', 'high',
    'Grapefruit inhibits CYP3A4 and P-glycoprotein, significantly increasing cyclosporine bioavailability. Elevated cyclosporine levels cause nephrotoxicity and hypertension.',
    'FDA prescribing information (Neoral); multiple pharmacokinetic studies'
  ),
  (
    (SELECT id FROM foods       WHERE name = 'Grapefruit'),
    'medication',
    (SELECT id FROM medications WHERE name = 'Sirolimus'),
    NULL,
    'avoid', 'high',
    'Grapefruit inhibits CYP3A4, increasing sirolimus blood levels unpredictably. Toxicity includes impaired wound healing, hyperlipidemia, and myelosuppression.',
    'FDA prescribing information (Rapamune)'
  ),
  (
    (SELECT id FROM foods       WHERE name = 'Grapefruit'),
    'medication',
    (SELECT id FROM medications WHERE name = 'Everolimus'),
    NULL,
    'avoid', 'high',
    'Grapefruit inhibits CYP3A4, increasing everolimus exposure unpredictably. Can cause everolimus toxicity.',
    'FDA prescribing information (Zortress)'
  ),
  -- Pomelo × calcineurin inhibitors
  (
    (SELECT id FROM foods       WHERE name = 'Pomelo'),
    'medication',
    (SELECT id FROM medications WHERE name = 'Tacrolimus'),
    NULL,
    'avoid', 'high',
    'Pomelo contains furanocoumarins identical in mechanism to grapefruit and carries the same CYP3A4 inhibition risk, raising tacrolimus blood levels dangerously.',
    'Clin Pharmacokinet 2012; transplant dietitian consensus'
  ),
  (
    (SELECT id FROM foods       WHERE name = 'Pomelo'),
    'medication',
    (SELECT id FROM medications WHERE name = 'Cyclosporine'),
    NULL,
    'avoid', 'high',
    'Pomelo furanocoumarins inhibit CYP3A4 and P-gp, increasing cyclosporine exposure similarly to grapefruit.',
    'Clin Pharmacokinet 2012'
  ),
  -- Seville Orange × tacrolimus
  (
    (SELECT id FROM foods       WHERE name = 'Seville Orange'),
    'medication',
    (SELECT id FROM medications WHERE name = 'Tacrolimus'),
    NULL,
    'avoid', 'high',
    'Seville (bitter) orange, used in marmalades and some juices, contains furanocoumarins that inhibit CYP3A4 and raise tacrolimus blood levels. Regular navel oranges do not carry this risk.',
    'Drug Metab Dispos 2006; FDA guidance'
  ),
  -- St. John''s Wort × tacrolimus and cyclosporine (opposite mechanism: inducer, not inhibitor)
  (
    (SELECT id FROM foods       WHERE name = 'St. John''s Wort'),
    'medication',
    (SELECT id FROM medications WHERE name = 'Tacrolimus'),
    NULL,
    'avoid', 'high',
    'St. John''s Wort is a potent CYP3A4 and P-glycoprotein inducer. It can reduce tacrolimus blood levels by 50–60%, causing sub-therapeutic immunosuppression and acute rejection.',
    'FDA Drug Safety Communication 2000; multiple transplant case reports'
  ),
  (
    (SELECT id FROM foods       WHERE name = 'St. John''s Wort'),
    'medication',
    (SELECT id FROM medications WHERE name = 'Cyclosporine'),
    NULL,
    'avoid', 'high',
    'St. John''s Wort induces CYP3A4 and P-gp, dramatically reducing cyclosporine exposure. Multiple documented cases of acute rejection in transplant recipients after starting St. John''s Wort.',
    'FDA Drug Safety Communication 2000; Lancet 2000 355(9203):547–8'
  ),
  -- High-potassium foods × low-potassium restriction
  (
    (SELECT id FROM foods              WHERE name = 'Banana'),
    'restriction',
    NULL,
    (SELECT id FROM dietary_restrictions WHERE name = 'Low Potassium'),
    'caution', 'medium',
    'A medium banana contains approximately 422 mg potassium — about 21% of a 2,000 mg daily limit. One banana is borderline; two in a day likely exceeds safe intake.',
    'USDA FoodData Central'
  ),
  (
    (SELECT id FROM foods              WHERE name = 'Avocado'),
    'restriction',
    NULL,
    (SELECT id FROM dietary_restrictions WHERE name = 'Low Potassium'),
    'avoid', 'medium',
    'A medium avocado contains approximately 708 mg potassium — over one-third of a 2,000 mg daily limit in a single serving.',
    'USDA FoodData Central'
  ),
  (
    (SELECT id FROM foods              WHERE name = 'Potato'),
    'restriction',
    NULL,
    (SELECT id FROM dietary_restrictions WHERE name = 'Low Potassium'),
    'caution', 'medium',
    'A large baked potato with skin contains approximately 925 mg potassium. Boiling diced potatoes and discarding the water reduces potassium by roughly 50%, making small portions more manageable.',
    'USDA FoodData Central; National Kidney Foundation'
  ),
  -- Immunocompromised food safety rules
  (
    (SELECT id FROM foods              WHERE name = 'Raw Oysters'),
    'restriction',
    NULL,
    (SELECT id FROM dietary_restrictions WHERE name = 'Immunocompromised Food Safety'),
    'avoid', 'high',
    'Raw oysters can harbor Vibrio vulnificus, which is frequently fatal in immunocompromised individuals. Even in healthy adults V. vulnificus causes severe illness; in transplant recipients the mortality rate is extremely high.',
    'CDC Food Safety; FDA; USDA'
  ),
  (
    (SELECT id FROM foods              WHERE name = 'Raw Sushi / Sashimi'),
    'restriction',
    NULL,
    (SELECT id FROM dietary_restrictions WHERE name = 'Immunocompromised Food Safety'),
    'avoid', 'high',
    'Raw fish carries risk of Listeria monocytogenes, Salmonella, and Anisakis (parasites). Immunosuppressed transplant recipients are at high risk for invasive listeriosis, which carries ~25% mortality.',
    'CDC; FDA Food Safety for People with Weakened Immune Systems'
  ),
  (
    (SELECT id FROM foods              WHERE name = 'Raw Sprouts'),
    'restriction',
    NULL,
    (SELECT id FROM dietary_restrictions WHERE name = 'Immunocompromised Food Safety'),
    'avoid', 'high',
    'Sprouts (alfalfa, bean, clover, radish) are frequently contaminated with E. coli O157:H7 and Salmonella due to the warm, humid sprouting environment. The FDA explicitly advises immunocompromised people not to eat raw sprouts.',
    'FDA Food Safety; CDC'
  ),
  (
    (SELECT id FROM foods              WHERE name = 'Brie (unpasteurized)'),
    'restriction',
    NULL,
    (SELECT id FROM dietary_restrictions WHERE name = 'Immunocompromised Food Safety'),
    'avoid', 'high',
    'Soft cheeses made from unpasteurized milk carry Listeria monocytogenes. Listeriosis in immunocompromised patients carries approximately 25% mortality. Pasteurized brie is safer but soft cheeses remain higher risk than hard cheeses.',
    'CDC Listeria guidelines; FDA'
  ),
  (
    (SELECT id FROM foods              WHERE name = 'Deli Meat / Cold Cuts'),
    'restriction',
    NULL,
    (SELECT id FROM dietary_restrictions WHERE name = 'Immunocompromised Food Safety'),
    'caution', 'medium',
    'Deli meats can harbor Listeria monocytogenes even when refrigerated, as Listeria grows at refrigerator temperatures. Safe to eat only if reheated to an internal temperature of 165°F (74°C) until steaming hot immediately before serving.',
    'CDC Listeria guidelines; USDA'
  );

-- +goose Down

TRUNCATE food_interactions;
TRUNCATE foods;
TRUNCATE dietary_restrictions;
TRUNCATE medications;
