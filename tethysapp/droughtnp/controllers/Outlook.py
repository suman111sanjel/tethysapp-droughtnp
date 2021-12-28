from django.shortcuts import render
from tethys_sdk.permissions import login_required
from tethys_sdk.gizmos import Button
from ..config import initilizationData

# @login_required()
def home(request):
    """
    Controller for the app home page.
    """

    context = {
        'CountryName':initilizationData['country'],
        'navLogoImage':initilizationData['navLogoImage'],
        'defaultView':initilizationData['defaultView'],
        'TethysAppName':initilizationData['TethysAppName'],
        'AdminLevel': initilizationData['AdminLevel'],
    }

    return render(request, 'droughtnp/outlook.html', context)
