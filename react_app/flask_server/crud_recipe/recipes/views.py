from flask import render_template,url_for,flash,redirect,request,Blueprint,abort
from flask_login import current_user,login_required
from crud_recipe import db
from crud_recipe.models import Ingredient,Recipe,RecipeToIngredient,User
from crud_recipe.recipes.forms import RecipeForm
import datetime
from sqlalchemy import select,delete
from pint import UnitRegistry, DimensionalityError
from crud_recipe.validate_recipe_form import ValidationError,validate_add_recipe_form
import json
from flask.json import jsonify
from pint import UnitRegistry
from flask_json import FlaskJSON, JsonError, json_response, as_json


recipe_views = Blueprint('recipes',__name__, url_prefix='/recipes')

@recipe_views.route("/add", methods=['GET', 'POST'])
# @login_required
def add_recipe():

    data = request.get_json()
    recipe_name = data['recipe']
    recipe_user_id = data['userId']

    if not data:
        return jsonify(success=False), 404


    new_recipe = Recipe(name=recipe_name, user_id=recipe_user_id)
    
    db.session.add(new_recipe)
    db.session.commit()
    # print(new_recipe)

    recipe_ingredients = data['ingredients']

    for ingredient in recipe_ingredients:
        ingredient_name = ingredient['name']
        ingredient_quantity = float(ingredient['quantity'])
        ingredient_measurement = ingredient['measurement']

        # produces a name or a none value in this variable
        ingredient = Ingredient.query.filter_by(name=ingredient_name).first()

        # if the ingredient is not in the ingredient table...
        if not ingredient:

            # create an instance of ingredient and commit 
            ingredient = Ingredient(name=ingredient_name)
            # print(ingredient),

            db.session.add(ingredient)
            db.session.commit()

        # this then needs to be done regardless of whether or not the ingredient has been added to our database before
        recipe_to_ingredient = RecipeToIngredient(recipe_id=new_recipe.id,
                                                ingredient_id=ingredient.id, 
                                                ingredient_quantity=ingredient_quantity, 
                                                ingredient_measurement=ingredient_measurement)

        db.session.add(recipe_to_ingredient)
        db.session.commit()
        

    return jsonify(success=True), 200



# int: makes sure that the recipe_id gets passed as in integer
# instead of a string so we can look it up later.
@as_json
@recipe_views.route('/viewrecipeingredients')
def recipe_view():

    recipe_id = request.args.get('recipeId', '')
    print(recipe_id)

    # grab the requested recipe by id number or return 404
    recipe = Recipe.query.get_or_404(recipe_id)

    # need some way below here to make all the ingredients in the recipe given above available for enumeration in html
    recipe_ingredients_query = (
                        db.session.query(Ingredient.name, RecipeToIngredient.ingredient_quantity, RecipeToIngredient.ingredient_measurement)
                        .join(Ingredient, RecipeToIngredient.ingredient_id == Ingredient.id)
                        .where(RecipeToIngredient.recipe_id == recipe.id)
                        )
                    
    recipe_ingredients = recipe_ingredients_query.all()
       
    
    return recipe_ingredients, 200


@recipe_views.route("/<int:recipe_id>/update", methods=['GET', 'POST'])
@login_required
def update(recipe_id):

    old_recipe = Recipe.query.get_or_404(recipe_id)
    update_recipe_form = RecipeForm()
    title = 'Update Recipe'

    if not update_recipe_form.validate_on_submit():
        update_recipe_form.recipe_name.data = old_recipe.name
        return render_template('enter_recipe.html', form=update_recipe_form, title=title, recipe_name=update_recipe_form.recipe_name.data)

    recipe_name = update_recipe_form.recipe_name.data

    updated_recipe = Recipe(name=recipe_name, user_id=current_user.id)

    # grabs the data from the enter ingredients field, splits it into lines, and makes it moldable
    recipe_data = update_recipe_form.enter_ingredients.data.splitlines()

    try:
        clean_ingredients = validate_add_recipe_form(recipe_data)
    except ValidationError as error:
        return render_template("enter_recipe.html", form=update_recipe_form, errors=error.errors)
            
    # deletes our old recipe and all of our ingredients that are linked to the old recipe
    db.session.delete(old_recipe)
    delete_old_ingredients_stmt = delete(RecipeToIngredient).where(RecipeToIngredient.recipe_id==old_recipe.id)
    db.session.execute(delete_old_ingredients_stmt)

    # now we add and commit the new one
    db.session.add(updated_recipe)
    db.session.commit()

    for ingredient_name, quantity_measurement in clean_ingredients.items():
        
        ingredient_quantity = quantity_measurement[0]
        ingredient_measurement = quantity_measurement[1]
    
        # produces a name or a none value in this variable
        ingredient = Ingredient.query.filter_by(name=ingredient_name).first()

        # if the ingredient is not in the ingredient table...
        if not ingredient:

            # create an instance of ingredient and commit 
            ingredient = Ingredient(name=ingredient_name)

            db.session.add(ingredient)
            db.session.commit()

        # this then needs to be done regardless of whether or not the ingredient has been added to our database before
        recipe_to_ingredient = RecipeToIngredient(recipe_id=updated_recipe.id,
                                                ingredient_id=ingredient.id, 
                                                ingredient_quantity=ingredient_quantity, 
                                                ingredient_measurement=ingredient_measurement)

        db.session.add(recipe_to_ingredient)
        db.session.commit()

    success_message = 'your recipe, ' + recipe_name + ', was updated!'
    return render_template('enter_recipe.html', form=update_recipe_form, success_message=success_message)
    


@recipe_views.route("/<int:recipe_id>/delete", methods=['POST'])
@login_required
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)

    delete_recipe_stmt = delete(Recipe).where(Recipe.id == recipe.id)
    delete_recipe_ingredients_stmt = delete(RecipeToIngredient).where(RecipeToIngredient.recipe_id == recipe.id)
    
    db.session.execute(delete_recipe_stmt)
    db.session.execute(delete_recipe_ingredients_stmt)
    db.session.commit()

    updated_user_recipes = Recipe.query.filter_by(user_id=current_user.id).all()

    message = 'Recipe deleted'

    return render_template('user_recipes.html', message=message, user=current_user, recipes=updated_user_recipes)