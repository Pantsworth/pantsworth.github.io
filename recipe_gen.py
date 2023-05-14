"""
Renders the main recipe page from the text in the recipes folder and the images in the images folder.
"""

import glob


def main():
	recipe_file = open("recipes.html", "w")
	recipe_list = sorted(glob.glob("recipes/*.html"))
	image_list = sorted(glob.glob("img/recipes/*.jpg"))

	recipe_html = ""
	for (index, r) in enumerate(recipe_list):
		

		thumb_lookup = [i for i in image_list if r.replace(".html", "") in i]
		if not thumb_lookup:
			raise LookupError("no thumb for {0}".format(r))
		thumb_file = [i for i in image_list if r.replace(".html", "") in i][0]

		recipe_title = r.replace('recipes/', '').replace('.html', '').replace("_", " ").upper().strip()
		print(repr(recipe_title))

		recipe_thumb = """<div class='flex-item'>
						<a href='{0}'>
						<div class="flex-item-img"><img style='height:150px;' src='{1}'></div>
						<h2 class='centered-title'>{2}</h2>
						</a>
						</div>""".format(r, 
										thumb_file, 
										recipe_title)
		recipe_html += recipe_thumb


	template_text = """	<!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <title>RECIPES LANDING</title>
		<link rel="stylesheet" type="text/css" href="css/recipestyle.css">
		<script src="js/recipe.js"></script>
	</head>
	<body>
    <hr>
	<div class="recipe-title">
	<input oninput="filter_recipes(this.value);" type="text" placeholder="Search..."></input>
	</div>
    <hr>
	<div class='flex-container'>
    {0}
	</div>
	</body>
	</html>
	""".format(recipe_html)

	recipe_file.write(template_text)
	print("succesfully wrote template: ", template_text)



if __name__ == '__main__':
	main()