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
						<img style='height:150px;' src='{1}'>
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
	    <title>RECIPES LANDING</title>
		<link rel="stylesheet" type="text/css" href="css/recipestyle.css">
		<script src="js/recipe.js"></script>
	</head>
	<body>
    <hr>
    <h2 class="centered-title">RECIPES</h2>
	<input oninput="filter_recipes(this.value);" type="text"></input>
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